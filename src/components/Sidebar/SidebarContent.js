import React from "react";
import { NavLink, Route } from "react-router-dom";

import { ReactComponent as CoronaSafeLogo } from "../../assets/icons/coronaSafeLogo.svg";
import routes from "../../routes/sidebar";
import SidebarSubmenu from "./SidebarSubmenu";

function SidebarContent() {
  return (
    <div className="flex flex-col justify-between min-h-full py-4 dark:text-gray-400 text-gray-500">
      <ul className="mt-2">
        {routes.map((route) =>
          route.routes ? (
            <SidebarSubmenu route={route} key={route.name} />
          ) : (
            <li className="px-6 py-3 relative" key={route.name}>
              {route.href ? (
                <a
                  href={route.href}
                  className="dark:hover:text-gray-200 items-center inline-flex text-sm font-semibold hover:text-gray-800 duration-150 transition-colors w-full"
                >
                  <span className="ml-4">{route.name}</span>
                </a>
              ) : (
                <NavLink
                  exact
                  to={route.path}
                  className="dark:hover:text-gray-200 items-center inline-flex text-sm font-semibold hover:text-gray-800 duration-150 transition-colors w-full"
                  activeClassName="text-gray-800 dark:text-gray-100"
                >
                  <Route path={route.path} exact={route.exact}>
                    <span
                      className="bg-green-500 rounded-br-lg rounded-tr-lg inset-y-0 left-0 absolute w-1"
                      aria-hidden="true"
                    />
                  </Route>
                  <span className="ml-4">{route.name}</span>
                </NavLink>
              )}
            </li>
          )
        )}
      </ul>
      <ul className="px-6 space-y-1">
        <ul className="flex text-sm space-x-2">
          <li>
            <a href="https://github.com/coronasafe/dashboard">Github</a>
          </li>
          <li>
            <a href="https://github.com/coronasafe/dashboard/issues">Issues</a>
          </li>
          <li>
            <a href="https://coronasafe.network/volunteer">Volunter</a>
          </li>
          <li>
            <a href="mailto:info@coronasafe.network">Contact</a>
          </li>
        </ul>
        <li className="flex flex-col">
          <a
            href="https://coronasafe.network/"
            className="inline-flex text-xs space-x-1"
          >
            <span>Copyright © 2020</span>
            <CoronaSafeLogo className="h-4" aria-hidden="true" />
          </a>
          <a
            href="https://github.com/coronasafe/dashboard/blob/master/LICENSE"
            className="text-xxs"
          >
            Released under the MIT License
          </a>
        </li>
      </ul>
    </div>
  );
}

export default SidebarContent;
