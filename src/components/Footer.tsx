import '../styles/footer.css'

export function Footer() {
  const currentYear = new Date().getFullYear()

  return (
    <footer className="footer">
      <div className="footer-inner">
        <p>
          &copy; {currentYear} Legalite.ai. All rights reserved. |{' '}
          <a href="#privacy">Privacy</a> | <a href="#terms">Terms</a>
        </p>
      </div>
    </footer>
  )
}
