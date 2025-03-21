export default function Footer() {
  return (
    <footer className="mt-auto py-6 bg-background border-t border-border">
      <div className="container mx-auto px-4">
        <div className="flex flex-col sm:flex-row justify-between items-center">
          <p className="text-muted-foreground text-sm mb-2 sm:mb-0">© 2023 Dog Gallery App</p>
          <div className="flex space-x-4">
            <a href="#" className="text-muted-foreground hover:text-primary text-sm transition-colors duration-200">About</a>
            <a href="#" className="text-muted-foreground hover:text-primary text-sm transition-colors duration-200">API</a>
            <a href="#" className="text-muted-foreground hover:text-primary text-sm transition-colors duration-200">Privacy</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
