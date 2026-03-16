import { NextRequest, NextResponse } from "next/server";
import { RoleEnum } from "./enums/role.enum";

const globalPublicRoutes = ['/public'];
const authBlockRoutes = ['/login', '/signup'];
const adminRoutes = ['/admin'];
const sellerRoutes = ['/seller/add_product', '/seller/products'];
const userRoutes = ['/user/products'];

export default function middleware(req: NextRequest) {
    const { pathname } = req.nextUrl;
    const token = req.cookies.get("token")?.value || null;
    const role = req.cookies.get("role")?.value || null;
    const isAuthenticated = Boolean(token);

    const matchesRoute = (routes: string[]) =>
        routes.some(route => pathname === route || pathname.startsWith(route + '/'));

    if (matchesRoute(globalPublicRoutes)) {
        return NextResponse.next();
    }

    if (isAuthenticated && matchesRoute(authBlockRoutes)) {
        return NextResponse.redirect(new URL("/", req.url));
    }

    const protectedRoutes = [...adminRoutes, ...sellerRoutes, ...userRoutes, '/'];
    if (!isAuthenticated && matchesRoute(protectedRoutes)) {
        return NextResponse.redirect(new URL("/login", req.url));
    }

    if (isAuthenticated) {
        if (matchesRoute(adminRoutes) && role !== RoleEnum.ADMIN) {
            return NextResponse.redirect(new URL("/", req.url));
        }
        if (matchesRoute(sellerRoutes) && role !== RoleEnum.SELLER) {
            return NextResponse.redirect(new URL("/", req.url));
        }
        if (matchesRoute(userRoutes) && role !== RoleEnum.USER) {
            return NextResponse.redirect(new URL("/", req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next|api|.*\\..*).*)'],
};