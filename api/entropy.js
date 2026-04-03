export default async function handler(req, res) {
  try {
    const response = await fetch(
      'https://random.colorado.edu/beacon/2.0/chain/last/pulse/last'
    );

    const text = await response.text();

    try {
      const data = JSON.parse(text);
      res.status(200).json(data);
    } catch {
      res.status(500).json({
        error: 'CURBy returned invalid JSON',
        raw: text.substring(0, 300)
      });
    }
  } catch (err) {
    res.status(500).json({
      error: 'Failed to fetch CURBy',
      details: err.message
    });
  }
}