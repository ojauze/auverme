export interface InstagramPost {
  id: string;
  title: string;
  date: Date;
  image?: string;
  link: string;
  description?: string;
}

/**
 * Récupère les posts Instagram via l'API Graph au moment du build.
 * Retourne [] si INSTAGRAM_ACCESS_TOKEN est absent ou si l'API échoue.
 */
export async function getInstagramPosts(limit = 12): Promise<InstagramPost[]> {
  const token = import.meta.env.INSTAGRAM_ACCESS_TOKEN;
  if (!token) return [];

  try {
    const res = await fetch(
      `https://graph.instagram.com/me/media?fields=id,caption,media_url,permalink,timestamp,media_type&limit=${limit}&access_token=${token}`
    );
    if (!res.ok) {
      console.error(`[instagram] API error ${res.status}`);
      return [];
    }
    const { data } = (await res.json()) as {
      data: {
        id: string;
        caption?: string;
        media_url: string;
        permalink: string;
        timestamp: string;
        media_type: string;
      }[];
    };
    return data
      .filter((p) => p.media_type !== "VIDEO")
      .map((p) => ({
        id:          p.id,
        title:       p.caption?.split("\n")[0]?.slice(0, 80) ?? "Post Instagram",
        date:        new Date(p.timestamp),
        image:       p.media_url,
        link:        p.permalink,
        description: p.caption ?? undefined,
      }));
  } catch (err) {
    console.error("[instagram] Erreur réseau —", err);
    return [];
  }
}
