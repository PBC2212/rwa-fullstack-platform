const Footer = () => {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4">
        {/* Bottom Bar */}
        <div className="py-6">
          <div className="flex flex-col md:flex-row items-center justify-center gap-4">
            <p className="text-primary-foreground/80 text-sm">
              © 2024 IME Capital Tokenization. All rights reserved.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;