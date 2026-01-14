import { Outlet } from "react-router-dom";

import { Main, Shell } from "./Layout.styles";

export default function Layout() {
    return (
        <Shell>
            <Main>
                <h2>Todos Application</h2>
                <Outlet />
            </Main>
        </Shell>
    );
}
