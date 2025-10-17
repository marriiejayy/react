function Footer() {
  return (
    <footer className="footer">
      <h3>social media Links</h3>
      <div className="social-links">

        <a href="https://twitter.com" 
          target="_blank" 
          className="social-link"
        >
        X
        </a>

        <a href="https://linkedin.com" 
          target="_blank"  
          className="social-link">
         LinkedIn
        </a>
        <a 
          href="https://github.com" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="social-link"
        >
         GitHub
        </a>
      </div>
      <p className="copyright">© 2025 Adesina Mariam. </p>
    </footer>
  );
}

export default Footer;