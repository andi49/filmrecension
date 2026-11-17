import { NextResponse } from "next/server";
import { pool } from "../../../lib/db";

export async function GET() {
    try {
        const [movies] = await pool.query('SELECT * FROM movies ORDER BY id ASC')
        return NextResponse.json(movies)
    } catch (error) {
        console.error('Database error', error)

        return NextResponse.json(
            {error: 'Kunde inte hämta filmer'},
            {status: 500}
        )
    }
}