import { serve, createRestManager } from "./deps.ts";

const manager = createRestManager({ token: Deno.env.get("TOKEN")! });
const notFound = new Response("", { status: 404 });

serve(async (req) => {
  const { pathname } = new URL(req.url);
  const id = pathname.replace(/.jpg|.jpeg|.png|.webp|\//g, "");
  if (!id || id == "favicon.ico") return notFound.clone();
  try {
    const { avatar }: { avatar: string } = await manager.runMethod(
      manager,
      "GET",
      `/users/${id}`
    );
    if (!avatar) return notFound.clone();
    return Response.redirect(
      `https://cdn.discordapp.com/avatars/${id}/${avatar}.png?size=2048`
    );
  } catch {
    return notFound.clone();
  }
});
