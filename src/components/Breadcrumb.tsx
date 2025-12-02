import { Link, useLocation } from "react-router-dom";

export default function Breadcrumb() {
  const location = useLocation();
  const pathParts = location.pathname.split("/").filter(Boolean);

  // Reconstruit les liens pas à pas
  const paths = pathParts.map((part, index) => ({
    label: part.charAt(0).toUpperCase() + part.slice(1).toLowerCase(), // jolie mise en forme
    path: "/" + pathParts.slice(0, index + 1).join("/")
  }));

  return (
    <nav className="text-[.8rem] text-gray-600">
      <ol className="flex items-center space-x-2">
        <li>
          <Link to="/" className="text-blue-600 hover:underline">
            Accueil
          </Link>
        </li>

        {paths.map((item, idx) => (
          <li key={item.path} className="flex items-center">
            <span className="mr-1.5 text-gray-400">/</span>

            {idx === paths.length - 1 ? (
              <span className="font-normal text-gray-400">{item.label}</span>
            ) : (
              <Link to={item.path} className="text-blue-600 hover:underline">
                {item.label}
              </Link>
            )}
          </li>
        ))}
      </ol>
    </nav>
  );
}
