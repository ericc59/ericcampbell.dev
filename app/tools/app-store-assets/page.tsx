"use client";

import { saveAs } from "file-saver";
import JSZip from "jszip";
import {
	ArrowLeft,
	ChevronLeft,
	Download,
	Package,
	Upload,
} from "lucide-react";
import Link from "next/link";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import type {
	ScreenshotDimensions,
	TemplateConfig,
} from "../../../lib/app-store-assets/config";
// Import configurations and utilities using relative paths
import {
	APP_ICON_SIZES,
	gradientPresets,
	SCREENSHOT_DIMENSIONS,
	TEMPLATES,
} from "../../../lib/app-store-assets/config";
import {
	applyTemplateToScreenshot,
	dataURLToBlob,
	generateResizedImage,
} from "../../../lib/app-store-assets/utils";

// --- REMOVED: Gradient Presets (moved to config.ts) ---
// --- REMOVED: Template Definitions (moved to config.ts) ---
// --- REMOVED: Constants for Asset Dimensions (moved to config.ts) ---
// --- REMOVED: Helper Function for Resizing Images (moved to utils.ts) ---
// --- REMOVED: Helper Function to Convert Data URL to Blob (moved to utils.ts) ---
// --- REMOVED: Helper Function to Apply Template to Screenshot (moved to utils.ts) ---

// Add debounce hook at the top of the file
function useDebounce<T>(value: T, delay: number): T {
	const [debouncedValue, setDebouncedValue] = useState<T>(value);

	useEffect(() => {
		const timer = setTimeout(() => {
			setDebouncedValue(value);
		}, delay);

		return () => {
			clearTimeout(timer);
		};
	}, [value, delay]);

	return debouncedValue;
}

export default function AppStoreAssetsPage() {
	const [iconSource, setIconSource] = useState<string | null>(null);
	const [screenshots, setScreenshots] = useState<string[]>([]);
	const [selectedTemplateKey, setSelectedTemplateKey] = useState<string>(
		Object.keys(TEMPLATES)[0],
	);
	const [generatedIcons, setGeneratedIcons] = useState<{
		[key: number]: string;
	}>({});
	const [generatedScreenshots, setGeneratedScreenshots] = useState<{
		[key: string]: string[];
	}>({});
	const [isLoading, setIsLoading] = useState(false);
	const [progressMessage, setProgressMessage] = useState("");

	// Error State
	const [iconError, setIconError] = useState<string | null>(null);
	const [screenshotError, setScreenshotError] = useState<string | null>(null);
	const [exportError, setExportError] = useState<string | null>(null);

	// State for background customization
	const [backgroundColor, setBackgroundColor] = useState(
		TEMPLATES[selectedTemplateKey].defaultBackgroundColor || "#FFFFFF",
	);
	const [gradientStart, setGradientStart] = useState(
		TEMPLATES[selectedTemplateKey].defaultGradientStart || "#4A90E2",
	);
	const [gradientEnd, setGradientEnd] = useState(
		TEMPLATES[selectedTemplateKey].defaultGradientEnd || "#5CB3FF",
	);

	// Frame (for templates with frames)
	const [frameColor, setFrameColor] = useState(
		TEMPLATES[selectedTemplateKey].frame?.color || "#000000",
	);
	const [frameThickness, setFrameThickness] = useState(
		TEMPLATES[selectedTemplateKey].frame?.thickness || 30,
	);
	const [frameOuterRadius, setFrameOuterRadius] = useState(
		TEMPLATES[selectedTemplateKey].frame?.outerRadius || 45,
	);
	const [frameInnerRadius, setFrameInnerRadius] = useState(
		TEMPLATES[selectedTemplateKey].frame?.innerRadius || 25,
	);
	const [frameOuterPadding, setFrameOuterPadding] = useState(
		TEMPLATES[selectedTemplateKey].frame?.outerPadding || 50,
	);

	// Padding (for templates without frames)
	const [paddingValue, setPaddingValue] = useState(
		TEMPLATES[selectedTemplateKey].padding || 50,
	);

	const iconInputRef = useRef<HTMLInputElement>(null);
	const screenshotsInputRef = useRef<HTMLInputElement>(null);

	// Add debounced versions of the state variables
	const debouncedFrameColor = useDebounce(frameColor, 150);
	const debouncedFrameThickness = useDebounce(frameThickness, 150);
	const debouncedFrameOuterRadius = useDebounce(frameOuterRadius, 150);
	const debouncedFrameInnerRadius = useDebounce(frameInnerRadius, 150);
	const debouncedFrameOuterPadding = useDebounce(frameOuterPadding, 150);
	const debouncedPaddingValue = useDebounce(paddingValue, 150);
	const debouncedBackgroundColor = useDebounce(backgroundColor, 150);
	const debouncedGradientStart = useDebounce(gradientStart, 150);
	const debouncedGradientEnd = useDebounce(gradientEnd, 150);

	// --- Upload Handlers ---
	const handleIconUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const file = e.target.files?.[0];
		if (file) {
			const reader = new FileReader();
			reader.onloadend = () => {
				setIconSource(reader.result as string);
				setIconError(null); // Clear error on new upload
			};
			// Handle potential read error
			reader.onerror = () => {
				setIconError("Failed to read icon file.");
				setIconSource(null);
			};
			reader.readAsDataURL(file);
		}
	};

	const handleScreenshotsUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
		const files = e.target.files;
		if (files && files.length > 0) {
			setScreenshotError(null); // Clear previous error
			const fileArray = Array.from(files);
			const promises = fileArray.map((file) => {
				return new Promise<string>((resolve, reject) => {
					const reader = new FileReader();
					reader.onloadend = () => resolve(reader.result as string);
					reader.onerror = () =>
						reject(new Error(`Failed to read file: ${file.name}`));
					reader.readAsDataURL(file);
				});
			});

			Promise.all(promises)
				.then((dataUrls) => {
					setScreenshots((prev) => [...prev, ...dataUrls]);
				})
				.catch((error) => {
					console.error("Error reading screenshot files:", error);
					setScreenshotError(
						error instanceof Error
							? error.message
							: "Failed to read one or more screenshot files.",
					);
				});
		}
	};

	// --- Effects for Generating Assets ---
	useEffect(() => {
		if (!iconSource) {
			setGeneratedIcons({});
			return;
		}

		let isMounted = true;
		const processIcons = async () => {
			if (!isMounted) return;
			setIsLoading(true);
			setProgressMessage("Processing icons...");
			setIconError(null);
			try {
				const resized: { [key: number]: string } = {};
				// Use Promise.all for potentially faster icon resizing
				const resizePromises = APP_ICON_SIZES.map(
					(size) =>
						generateResizedImage(iconSource, size).then((dataUrl) => ({
							size,
							dataUrl,
						})), // Keep track of size
				);
				const results = await Promise.all(resizePromises);
				results.forEach((result) => {
					resized[result.size] = result.dataUrl;
				});

				if (isMounted) setGeneratedIcons(resized);
			} catch (error) {
				console.error("Error generating icons:", error);
				if (isMounted)
					setIconError(
						error instanceof Error
							? error.message
							: "Failed to generate icons.",
					);
			} finally {
				if (isMounted) {
					setIsLoading(false);
					setProgressMessage("");
				}
			}
		};
		processIcons();
		return () => {
			isMounted = false;
		}; // Cleanup function
	}, [iconSource]);

	// Effect to update customization state when template changes
	useEffect(() => {
		const template = TEMPLATES[selectedTemplateKey];
		if (template) {
			// Update background state
			setBackgroundColor(template.defaultBackgroundColor || "#FFFFFF");
			setGradientStart(template.defaultGradientStart || "#4A90E2");
			setGradientEnd(template.defaultGradientEnd || "#5CB3FF");

			// Update frame state (if applicable)
			if (template.frame) {
				setFrameColor(template.frame.color || "#000000");
				setFrameThickness(template.frame.thickness || 30);
				setFrameOuterRadius(template.frame.outerRadius || 45);
				setFrameInnerRadius(template.frame.innerRadius || 25);
				setFrameOuterPadding(template.frame.outerPadding ?? 50);
			}

			// Update padding state (if applicable)
			if (template.padding !== undefined) {
				// Check specifically for padding property
				setPaddingValue(template.padding);
			}
		}
	}, [selectedTemplateKey]);

	// Effect to generate screenshots when inputs or template settings change
	useEffect(() => {
		if (screenshots.length === 0) {
			setGeneratedScreenshots({});
			return;
		}

		let isMounted = true;
		const processScreenshots = async () => {
			if (!isMounted) return;
			setIsLoading(true);
			setProgressMessage("Applying templates to screenshots...");
			setScreenshotError(null);
			try {
				const processed: { [key: string]: string[] } = {};
				const dimensions = SCREENSHOT_DIMENSIONS as ScreenshotDimensions;
				const currentTemplate = TEMPLATES[selectedTemplateKey];

				if (!currentTemplate) {
					throw new Error("Selected template configuration not found!");
				}

				for (const deviceName in dimensions) {
					const targetDim = dimensions[deviceName];
					const screenshotPromises = screenshots.map((screenshotUrl) =>
						// Pass current customization state to the utility function
						applyTemplateToScreenshot(
							screenshotUrl,
							targetDim.width,
							targetDim.height,
							currentTemplate, // Still pass base template for type checking etc.
							debouncedBackgroundColor,
							debouncedGradientStart,
							debouncedGradientEnd,
							// Pass frame/padding state values explicitly
							debouncedFrameColor,
							debouncedFrameThickness,
							debouncedFrameOuterRadius,
							debouncedFrameInnerRadius,
							debouncedPaddingValue, // Padding for non-frame templates
							debouncedFrameOuterPadding, // Outer padding for frame templates
						),
					);
					processed[deviceName] = await Promise.all(screenshotPromises);
					if (!isMounted) return;
				}

				if (isMounted) setGeneratedScreenshots(processed);
			} catch (error) {
				console.error("Error processing screenshots:", error);
				if (isMounted)
					setScreenshotError(
						error instanceof Error
							? error.message
							: "Failed to apply template to screenshots.",
					);
			} finally {
				if (isMounted) {
					setIsLoading(false);
					setProgressMessage("");
				}
			}
		};
		processScreenshots();
		return () => {
			isMounted = false;
		};
	}, [
		screenshots,
		selectedTemplateKey,
		debouncedBackgroundColor,
		debouncedGradientStart,
		debouncedGradientEnd,
		// Add new state dependencies
		debouncedFrameColor,
		debouncedFrameThickness,
		debouncedFrameOuterRadius,
		debouncedFrameInnerRadius,
		debouncedPaddingValue,
		debouncedFrameOuterPadding,
	]);

	// --- Handle Export ---
	const handleExport = async () => {
		if (!iconSource || screenshots.length === 0 || isLoading) return; // Prevent export if already loading

		setIsLoading(true);
		setProgressMessage("Generating zip file...");
		setExportError(null);
		console.log("Starting export...");
		const zip = new JSZip();

		try {
			// Add Icons
			const iconsFolder = zip.folder("AppIcons");
			if (iconsFolder) {
				for (const size in generatedIcons) {
					const blob = dataURLToBlob(generatedIcons[size]);
					if (blob) {
						iconsFolder.file(`AppIcon-${size}x${size}.png`, blob);
					} else {
						console.warn(`Could not convert icon ${size}x${size} to Blob.`);
					}
				}
			}

			// Add Screenshots
			const screenshotsRootFolder = zip.folder("Screenshots");
			if (screenshotsRootFolder) {
				for (const deviceName in generatedScreenshots) {
					const deviceFolder = screenshotsRootFolder.folder(
						deviceName.replace(/[\\/:*?"<>|]/g, "-"), // Sanitize folder name more robustly
					);
					if (deviceFolder) {
						generatedScreenshots[deviceName].forEach((url, index) => {
							const blob = dataURLToBlob(url);
							if (blob) {
								deviceFolder.file(`Screenshot_${index + 1}.png`, blob);
							} else {
								console.warn(
									`Could not convert screenshot ${deviceName} #${
										index + 1
									} to Blob.`,
								);
							}
						});
					}
				}
			}

			console.log("Generating zip file blob...");
			const content = await zip.generateAsync({ type: "blob" });
			console.log("Zip file generated, triggering download.");
			saveAs(content, "AppStoreAssets.zip");
		} catch (error) {
			console.error("Error during zip generation or download:", error);
			setExportError(
				error instanceof Error ? error.message : "Failed to generate zip file.",
			);
		} finally {
			setIsLoading(false);
			setProgressMessage("");
			console.log("Export finished.");
		}
	};

	// --- Render Logic ---
	return (
		<div className="flex fixed w-full inset-0 bg-gray-950 text-white">
			<Link
				href="/tools"
				className="absolute text-white top-4 left-4 flex items-center gap-1 z-10"
			>
				<ChevronLeft className="size-4 text-gray-400" />
				Go Back
			</Link>

			{/* Main Content Area */}
			<div className="flex-1 p-8 flex flex-col items-center overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
				<h1 className="text-2xl font-bold mb-6 w-full text-center">
					App Store Asset Generator
				</h1>

				{/* Loading Overlay */}
				{isLoading && (
					<div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
						<div className="bg-gray-800 p-4 rounded-lg text-white flex items-center gap-2">
							<svg
								className="animate-spin h-5 w-5 text-white"
								xmlns="http://www.w3.org/2000/svg"
								fill="none"
								viewBox="0 0 24 24"
							>
								<circle
									className="opacity-25"
									cx="12"
									cy="12"
									r="10"
									stroke="currentColor"
									strokeWidth="4"
								></circle>
								<path
									className="opacity-75"
									fill="currentColor"
									d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
								></path>
							</svg>
							{progressMessage || "Processing..."}
						</div>
					</div>
				)}

				{/* Display Errors */}
				<div className="w-full max-w-4xl mb-4 space-y-2">
					{iconError && (
						<div className="p-3 bg-red-900 text-red-200 border border-red-700 rounded-md text-sm">
							<strong>Icon Error:</strong> {iconError}
						</div>
					)}
					{screenshotError && (
						<div className="p-3 bg-red-900 text-red-200 border border-red-700 rounded-md text-sm">
							<strong>Screenshot Error:</strong> {screenshotError}
						</div>
					)}
					{exportError && (
						<div className="p-3 bg-red-900 text-red-200 border border-red-700 rounded-md text-sm">
							<strong>Export Error:</strong> {exportError}
						</div>
					)}
				</div>

				{/* Preview Area */}
				<div className="w-full max-w-6xl space-y-8">
					{/* Icon Previews */}
					{Object.keys(generatedIcons).length > 0 && (
						<div>
							<h2 className="text-xl font-semibold mb-4">Generated Icons</h2>
							<div className="flex flex-wrap gap-4 items-end">
								{Object.entries(generatedIcons)
									.sort(([sizeA], [sizeB]) => Number(sizeB) - Number(sizeA)) // Sort largest first
									.map(([size, dataUrl]) => (
										<div key={size} className="text-center">
											<img
												src={dataUrl}
												alt={`Icon ${size}x${size}`}
												className="border border-gray-700 bg-gray-800 object-contain" // Added background
												style={{
													width: `${Math.min(Number(size) / 4, 100)}px`,
													height: `${Math.min(Number(size) / 4, 100)}px`,
												}} // Adjusted preview size
											/>
											<p className="text-xs text-gray-400 mt-1">
												{size}x{size}
											</p>
										</div>
									))}
							</div>
						</div>
					)}

					{/* Screenshot Previews */}
					{Object.keys(generatedScreenshots).length > 0 && (
						<div>
							<h2 className="text-xl font-semibold mb-4">
								Generated Screenshots
							</h2>
							{Object.entries(generatedScreenshots).map(
								([deviceName, urls]) => (
									<div key={deviceName} className="mb-6">
										<h3 className="text-lg font-medium text-gray-300 mb-2">
											{deviceName}
										</h3>
										<div className="flex space-x-4 overflow-x-auto pb-4 scrollbar-thin scrollbar-thumb-gray-600 scrollbar-track-gray-800">
											{urls.map((url, index) => (
												<img
													key={index}
													src={url}
													alt={`${deviceName} Screenshot ${index + 1}`}
													className="border border-gray-700 h-80 w-auto flex-shrink-0 bg-gray-800" // Added background
												/>
											))}
										</div>
									</div>
								),
							)}
						</div>
					)}

					{(!iconSource || screenshots.length === 0) && !isLoading && (
						<div className="text-center text-gray-500 pt-10">
							Upload an icon and some screenshots using the controls on the
							right to get started.
						</div>
					)}
				</div>
			</div>

			{/* Controls Sidebar */}
			<div className="w-80 bg-gray-900 border-l border-gray-800 p-6 overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-gray-800">
				<div className="space-y-6">
					{/* Upload Controls */}
					<div className="space-y-2 p-4 bg-gray-800 rounded-lg">
						<h3 className="font-medium text-gray-300">Upload Assets</h3>
						<button
							className="w-full flex items-center justify-center gap-2 px-4 py-2 text-white rounded-md border border-gray-600 hover:bg-gray-700 transition-colors"
							onClick={() => iconInputRef.current?.click()}
							title="Upload a 1024x1024 source image for the app icon (PNG recommended)"
						>
							<Upload className="w-4 h-4 flex-shrink-0" />
							<span className="truncate">Upload App Icon Source</span>
						</button>
						<input
							type="file"
							ref={iconInputRef}
							onChange={handleIconUpload}
							accept="image/png, image/jpeg, image/webp"
							className="hidden"
						/>
						{iconSource && (
							<p className="text-xs text-green-400 text-center">Icon ready!</p>
						)}

						<button
							className="w-full flex items-center justify-center gap-2 px-4 py-2 text-white rounded-md border border-gray-600 hover:bg-gray-700 transition-colors"
							onClick={() => screenshotsInputRef.current?.click()}
							title="Upload one or more screenshots (PNG or JPEG)"
						>
							<Upload className="w-4 h-4 flex-shrink-0" />
							<span className="truncate">Upload Screenshots</span>
						</button>
						<input
							type="file"
							ref={screenshotsInputRef}
							onChange={handleScreenshotsUpload}
							accept="image/png, image/jpeg, image/webp"
							multiple
							className="hidden"
						/>
						{screenshots.length > 0 && (
							<p className="text-xs text-green-400 text-center">
								{screenshots.length} screenshot
								{screenshots.length !== 1 ? "s" : ""} ready!
							</p>
						)}
					</div>

					{/* Template Selection & Customization */}
					<div className="space-y-4 p-4 bg-gray-800 rounded-lg">
						<h3 className="font-medium text-gray-300 mb-2">Template</h3>
						<select
							value={selectedTemplateKey}
							onChange={(e) => setSelectedTemplateKey(e.target.value)}
							className="w-full p-2 rounded bg-gray-700 text-white border border-gray-600 mb-4"
						>
							{Object.entries(TEMPLATES).map(
								([key, template]: [string, TemplateConfig]) => (
									<option key={key} value={key}>
										{template.name}
									</option>
								),
							)}
						</select>

						{/* Background Controls */}
						{TEMPLATES[selectedTemplateKey]?.backgroundType === "color" && (
							<div>
								<label className="block text-sm text-gray-400 mb-1">
									Background Color
								</label>
								<input
									type="color"
									value={debouncedBackgroundColor}
									onChange={(e) => setBackgroundColor(e.target.value)}
									className="w-full h-10 rounded cursor-pointer border border-gray-600"
								/>
							</div>
						)}

						{TEMPLATES[selectedTemplateKey]?.backgroundType === "gradient" && (
							<div className="space-y-2">
								<label className="block text-sm text-gray-400 mb-1">
									Background Gradient
								</label>
								<div className="flex space-x-2">
									<input
										type="color"
										value={debouncedGradientStart}
										onChange={(e) => setGradientStart(e.target.value)}
										className="w-1/2 h-10 rounded cursor-pointer border border-gray-600"
										title="Gradient Start Color"
									/>
									<input
										type="color"
										value={debouncedGradientEnd}
										onChange={(e) => setGradientEnd(e.target.value)}
										className="w-1/2 h-10 rounded cursor-pointer border border-gray-600"
										title="Gradient End Color"
									/>
								</div>
								{/* Gradient Presets */}
								<div className="mt-3">
									<label className="block text-xs text-gray-500 mb-2">
										Presets
									</label>
									{Object.entries(gradientPresets).map(
										([groupName, presets]) => (
											<div key={groupName} className="mb-2">
												<p className="text-xs text-gray-400 mb-1">
													{groupName}
												</p>
												<div className="grid grid-cols-6 gap-1">
													{presets.map((preset, index) => (
														<button
															key={index}
															className="w-full aspect-square border border-gray-600 rounded hover:ring-2 hover:ring-blue-500 transition-all"
															style={{
																background: `linear-gradient(to right, ${preset.colors[0]}, ${preset.colors[1]})`,
															}}
															onClick={() => {
																setGradientStart(preset.colors[0]);
																setGradientEnd(preset.colors[1]);
															}}
															title={preset.name}
														/>
													))}
												</div>
											</div>
										),
									)}
								</div>
							</div>
						)}

						{/* Divider */}
						<hr className="border-gray-700 my-4" />

						{/* Frame / Padding Controls */}
						{TEMPLATES[selectedTemplateKey]?.frame ? (
							// --- Frame Controls ---
							<div className="space-y-3">
								<h4 className="text-sm font-medium text-gray-300">
									Frame Settings
								</h4>
								<div>
									<label className="block text-xs text-gray-400 mb-1">
										Frame Color
									</label>
									<input
										type="color"
										value={debouncedFrameColor}
										onChange={(e) => setFrameColor(e.target.value)}
										className="w-full h-10 rounded cursor-pointer border border-gray-600"
									/>
								</div>
								<div>
									<label className="block text-xs text-gray-400 mb-1">
										Thickness ({debouncedFrameThickness}px)
									</label>
									<input
										type="range"
										min="0"
										max="100"
										step="1"
										value={debouncedFrameThickness}
										onChange={(e) => setFrameThickness(Number(e.target.value))}
										className="w-full"
									/>
								</div>
								<div>
									<label className="block text-xs text-gray-400 mb-1">
										Outer Radius ({debouncedFrameOuterRadius}px)
									</label>
									<input
										type="range"
										min="0"
										max="100"
										step="1"
										value={debouncedFrameOuterRadius}
										onChange={(e) =>
											setFrameOuterRadius(Number(e.target.value))
										}
										className="w-full"
									/>
								</div>
								<div>
									<label className="block text-xs text-gray-400 mb-1">
										Screen Radius ({debouncedFrameInnerRadius}px)
									</label>
									<input
										type="range"
										min="0"
										max="100"
										step="1"
										value={debouncedFrameInnerRadius}
										onChange={(e) =>
											setFrameInnerRadius(Number(e.target.value))
										}
										className="w-full"
									/>
								</div>
								<div>
									<label className="block text-xs text-gray-400 mb-1">
										Outer Padding ({debouncedFrameOuterPadding}px)
									</label>
									<input
										type="range"
										min="0"
										max="200"
										step="1"
										value={debouncedFrameOuterPadding}
										onChange={(e) =>
											setFrameOuterPadding(Number(e.target.value))
										}
										className="w-full"
									/>
								</div>
							</div>
						) : (
							// --- Padding Controls ---
							<div className="space-y-3">
								<h4 className="text-sm font-medium text-gray-300">Spacing</h4>
								<div>
									<label className="block text-xs text-gray-400 mb-1">
										Padding ({debouncedPaddingValue}px)
									</label>
									<input
										type="range"
										min="0"
										max="200"
										step="1"
										value={debouncedPaddingValue}
										onChange={(e) => setPaddingValue(Number(e.target.value))}
										className="w-full"
									/>
								</div>
							</div>
						)}
					</div>

					{/* Export Button */}
					<div className="space-y-2 p-4 bg-gray-800 rounded-lg">
						<button
							className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
							disabled={!iconSource || screenshots.length === 0 || isLoading}
							onClick={handleExport}
						>
							<Package className="w-4 h-4" />
							{isLoading ? "Generating..." : "Generate & Download (.zip)"}
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}
