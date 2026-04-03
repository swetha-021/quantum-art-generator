export default async function handler(req, res) {
  try {
    const response = await fetch(
      'https://random.colorado.edu/beacon/2.0/pulse/last'
    );

    const text = await response.text();

    res.status(200).send(text);
  } catch (err) {
    res.status(500).json({
      error: 'Failed to fetch CURBy',
      details: err.message
    });
  }
}