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


export async function POST(request) {
      try {
    const body = await request.json()
    
   const { title, description, genre, release_year } = body;

   if(!title || !genre || !description || !release_year) {
    return NextResponse.json(
       { error: "Titel, genre och utgivningsår krävs" },
        {status: 400}
    )
   }
   const sql = `
  INSERT INTO movies (title, description, genre, release_year)
  VALUES (?, ?, ?, ?)`;

  const [result] = await pool.execute(sql, [
    title,
    description ?? null,
    genre,
    release_year,
  ])

  return NextResponse.json(
    {
        message: 'Filmen skapades',
        movieID: result.insertId
    },
    {status: 201}
  )

} catch(error) {
    console.error('POST MOVIE ERROR:', error)

    return NextResponse.json(
        {error: 'KUNDE INTE SKAPA FILMEN'},
        {status: 500}
    )
}
}
