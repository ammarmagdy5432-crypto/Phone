import { Link, useDocumentTitle, useRouter } from '../lib/router';
import { EmptyState } from '../components/UI';

export default function NotFoundPage() {
  useDocumentTitle('Page Not Found');
  const { pathname } = useRouter();

  return (
    <div className="page notfound-page">
      <div className="container">
        <EmptyState
          icon="alert"
          headingAs="h1"
          title="The page you’re looking for can’t be found."
          description={`No page exists at “${pathname}”. Try heading back home or browsing the site map.`}
        >
          <Link to="/" className="btn btn-primary">
            Back to home
          </Link>
          <Link to="/buy" className="btn btn-secondary">
            Buy iPhone 15 Pro
          </Link>
          <Link to="/sitemap" className="btn btn-ghost">
            Site Map
          </Link>
        </EmptyState>
      </div>
    </div>
  );
}
