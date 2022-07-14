import { serve, createRestManager } from "./deps.ts";

const manager = createRestManager({ token: Deno.env.get("TOKEN")! });

serve(async (req) => {
  const matches = new URL(req.url).pathname.match(/^\/(\d{18})$/);

  if (!matches) {
    return new Response("No valid ID", { status: 400 });
  }

  const [_, id] = matches;

  try {
    const { avatar, discriminator }: { avatar: string; discriminator: string } =
      await manager.runMethod(manager, "GET", `/users/${id}`);

    if (avatar) {
      return Response.redirect(
        `https://cdn.discordapp.com/avatars/${id}/${avatar}.png?size=2048`
      );
    } else {
      return Response.redirect(
        `https://cdn.discordapp.com/embed/avatars/${
          parseInt(discriminator) % 5
        }.png`
      );
    }
  } catch {
    return new Response("User not found", { status: 404 });
  }
});
