const fetch = require('node-fetch');

const AUTH_TOKEN = 'Bearer YXBpLWNsaWVudC0xMzg0MWM0MC1hNWNlLTQwZjYtOGM5Ny0wYTIzMmU4ZGU0ZWNAY2hlcnJlLmNvbTpOdUNCJEtYcSVlV3lrSSVnUVY3eTlNczNNbWRzZ0hJUlUwISNCSkM0aFVPWGUzcDI3TjRhRUNac1gyOVFodXZO';

const handler = async (req, res) => {
  const query = `
    query {
      tax_assessor_v2(limit: 100) {
        tax_assessor_id
        year_built
        last_sale_date
        mailing_address
      }
      tax_assessor_owner_v2(limit: 100) {
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
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query })
    });

    const raw = await response.text();
    const json = JSON.parse(raw);

    if (json.errors) {
      return res.status(500).json({ error: 'GraphQL query failed', details: json.errors });
    }

    // Stitch owners into properties by tax_assessor_id
    const ownersById = {};
    for (const owner of json.data.tax_assessor_owner_v2) {
      const id = owner.tax_assessor_id;
      if (!ownersById[id]) ownersById[id] = [];
      ownersById[id].push(owner);
    }

    const merged = json.data.tax_assessor_v2.map((property) => ({
      ...property,
      owners: ownersById[property.tax_assessor_id] || []
    }));

    return res.status(200).json(merged);
  } catch (err) {
    console.error('[SERVER ERROR]', err);
    return res.status(500).json({
      error: 'Serverless function crashed',
      details: err.message
    });
  }
};

module.exports = handler;
