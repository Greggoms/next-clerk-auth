const Footer = () => {
  return (
    <footer className="p-2 dark:bg-slate-800">
      <div className="container">
        <span>&copy; {new Date().getFullYear()} clerk-auth</span>
      </div>
    </footer>
  );
};

export default Footer;
