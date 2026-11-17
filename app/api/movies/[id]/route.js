import { NextResponse } from "next/server";
import { pool } from "../../../../lib/db";


export async function GET(request, { params }) {
  try {
    const { id } = await params;

    const [movies] = await pool.execute(
      "SELECT * FROM movies WHERE id = ?",
      [id]
    );

    if (movies.length === 0) {
      return NextResponse.json(
        { error: "Filmen hittades inte" },
        { status: 404 }
      );
    }

    return NextResponse.json(movies[0]);
  } catch (error) {
    console.error("GET movie error:", error);

    return NextResponse.json(
      { error: "Kunde inte hämta filmen" },
      { status: 500 }
    );
  }
}



export async function PUT(request, { params }) {
  try {
    const { id } = await params;

    const body = await request.json();

    const { title, description, genre, release_year } = body;

    if (!title || !genre || !release_year) {
      return NextResponse.json(
        { error: "Titel, genre och utgivningsår krävs" },
        { status: 400 }
      );
    }

    const sql = `UPDATE movies SET title = ?, description = ?, genre = ?, release_year = ? WHERE id = ?`;

    const [result] = await pool.execute(sql, [
      title,
      description ?? null,
      genre,
      release_year,
      id,
    ]);

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: "Filmen hittades inte" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Filmen uppdaterades!",
      movieID: Number(id),
    });
  } catch (error) {
    console.error("PUT movie error:", error);

    return NextResponse.json(
      { error: "Kunde inte uppdatera filmen" },
      { status: 500 }
    );
  }
}



export async function DELETE(request, { params }) {
  try {
    const { id } = await params;

    const [result] = await pool.execute(
      "DELETE FROM movies WHERE id = ?",
      [id]
    );

    if (result.affectedRows === 0) {
      return NextResponse.json(
        { error: "Filmen hittades inte" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      message: "Filmen raderades!",
      movieID: Number(id),
    });
  } catch (error) {
    console.error("DELETE movie error:", error);

    return NextResponse.json(
      { error: "Kunde inte radera filmen" },
      { status: 500 }
    );
  }
}
