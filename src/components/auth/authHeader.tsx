import Image from "next/image";

/**
 * AuthHeader - Header component for authentication pages
 * Shows on tablet view (md) and hides on mobile and desktop
 * Desktop already has the logo in the left marketing column
 */
export default function AuthHeader() {
  return (
    <header
      className="block lg:hidden bg-[#201F24] py-6"
      aria-label="Authentication header"
    >
      <div className="flex justify-center">
        <Image
          src="/assets/images/logo-large.svg"
          alt="Finance"
          width={122}
          height={22}
          priority
        />
      </div>
    </header>
  );
}
