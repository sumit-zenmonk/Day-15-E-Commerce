import { NextRequest, NextResponse } from "next/server";
import { Role } from "./app/(global)/(Auth)/role.enum";

const globalPublicRoutes = ['/public'];
const authBlockRoutes = ['/login', '/signup'];
const adminRoutes = ['/admin'];
const sellerRoutes = ['/add_product'];
const userRoutes = ['/dashboard'];

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
        console.log('hye ', role, matchesRoute(adminRoutes), matchesRoute(sellerRoutes), matchesRoute(userRoutes), pathname);
        if (matchesRoute(adminRoutes) && role !== Role.ADMIN) {
            return NextResponse.redirect(new URL("/", req.url));
        }
        if (matchesRoute(sellerRoutes) && role !== Role.SELLER) {
            return NextResponse.redirect(new URL("/", req.url));
        }
        if (matchesRoute(userRoutes) && role !== Role.USER) {
            return NextResponse.redirect(new URL("/", req.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: ['/((?!_next|api|.*\\..*).*)'],
};