const fetch = require('node-fetch');

// 🔐 Secure: pulls from Vercel or .env.local
const AUTH_TOKEN = process.env.CHERRE_TOKEN;

module.exports = async (req, res) => {
  const { limit = 50, offset = 0, search = '' } = req.query;

 const query = `
  query {
    tax_assessor_v2(limit: ${limit}, offset: ${offset}) {
      tax_assessor_id
      year_built
      last_sale_date
      mailing_address
      latitude
      longitude
    }
    tax_assessor_owner_v2(limit: 1000) {
      tax_assessor_id
      owner_name
      owner_type
    }
  }
`;

  try {
    const response = await fetch('https://graphql.cherre.com/graphql', {
      method: 'POST',
      headers: {
        Authorization: AUTH_TOKEN,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ query }),
    });

    const data = await response.json();

    // 🔗 Join owner data to property
    const ownersById = {};
    for (const owner of data.data.tax_assessor_owner_v2) {
      const id = owner.tax_assessor_id;
      if (!ownersById[id]) ownersById[id] = [];
      ownersById[id].push(owner);
    }

    let merged = data.data.tax_assessor_v2.map((property) => ({
      ...property,
      owners: ownersById[property.tax_assessor_id] || [],
    }));

    // 🔍 Filter by search
    if (search) {
      merged = merged.filter((p) =>
        (p.mailing_address || '').toLowerCase().includes(search.toLowerCase()) ||
        (p.owners || []).some((o) =>
          (o.owner_name || '').toLowerCase().includes(search.toLowerCase())
        )
      );
    }

    return res.status(200).json(merged);
  } catch (err) {
    console.error('[CHERRE ERROR]', err);
    return res.status(500).json({
      error: 'Internal server error',
      details: err.message,
    });
  }
};
