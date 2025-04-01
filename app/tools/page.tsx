import Image from 'next/image';
import Link from 'next/link';

export default function ToolsPage() {
  return (
    <div>
      <h1 className="text-2xl font-bold">Tools</h1>

      <div className="grid gap-4 mt-4">
        <Link
          href="/tools/product-screenshot"
          className="block p-4 border rounded-lg bg-white hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-4 w-full relative">
            <Image
              src="/images/tools/product-screenshot.png"
              alt="Product Screenshot Tool"
              className=" object-cover rounded w-64 h-auto"
              sizes="(max-width: 768px) 100vw, 384px"
              width={1973}
              height={1234}
            />
            <div>
              <h2 className="text-2xl font-semibold">Product Screenshot</h2>
              <p className="text-gray-600">
                Create beautiful product screenshots
              </p>
            </div>
          </div>
        </Link>

        {/* App Store Assets Tool Card */}
        <Link
          href="/tools/app-store-assets"
          className="block p-4 border rounded-lg bg-white hover:bg-gray-50 transition-colors"
        >
          <div className="flex items-center gap-4 w-full relative">
            {/* TODO: Create and add /images/tools/app-store-assets.png */}
            <div className="w-64 h-40 bg-gray-200 rounded flex items-center justify-center text-gray-500">
              Placeholder
            </div>
            <div>
              <h2 className="text-2xl font-semibold">App Store Assets</h2>
              <p className="text-gray-600">
                Generate all required iOS App Store assets (icon & screenshots)
              </p>
            </div>
          </div>
        </Link>
      </div>
    </div>
  );
}
