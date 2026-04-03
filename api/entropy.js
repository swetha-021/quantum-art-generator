export default async function handler(req, res) {
  try {
    const response = await fetch(
      'https://random.colorado.edu/beacon/2.0/chain/last/pulse/last.json'
    );

    const data = await response.json();

    res.status(200).json(data);
  } catch (err) {
    res.status(500).json({
      error: 'Failed to fetch CURBy',
      details: err.message
    });
  }
}