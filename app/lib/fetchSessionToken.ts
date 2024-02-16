export async function fetchSessionToken(sessionName: string): Promise<string | null> {
  return executeWithRetry(async () => {
    const client = await connect();
    const db = client.db('GoGetKids');
    const session = await db.collection('sessions').findOne({ sessionName });

    await client.close();
    return session ? session.token : null;
  });
}