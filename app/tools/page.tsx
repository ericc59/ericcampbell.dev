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
      </div>
    </div>
  );
}
