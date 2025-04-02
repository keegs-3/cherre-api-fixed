const fetch = require('node-fetch');

const AUTH_TOKEN = 'Bearer YXBpLWNsaWVudC0xMzg0MWM0MC1hNWNlLTQwZjYtOGM5Ny0wYTIzMmU4ZGU0ZWNAY2hlcnJlLmNvbTpOdUNCJEtYcSVlV3lrSSVnUVY3eTlNczNNbWRzZ0hJUlUwISNCSkM0aFVPWGUzcDI3TjRhRUNac1gyOVFodXZO;

const handler = async (req, res) => {
  const query = `
    query {
      tax_assessor_v2(limit: 100) {
        tax_assessor_id
        assessed_value
        market_value
        zoning_code
        year_built
        land_area_acres
        building_area_sq_ft
        last_sale_price
        last_sale_date
        property_type
        owner_occupied
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

    const result = await response.json();

    console.log('[CHERRE DEBUG]:', JSON.stringify(result, null, 2)); // 🧪 Safe logging

    if (result.errors) {
      return res.status(500).json({
        error: 'GraphQL query failed',
        details: result.errors,
      });
    }

    return res.status(200).json(result.data.tax_assessor_v2 || []);
  } catch (err) {
    console.error('[API CRASH]', err); // 🔍 Crash visibility
    return res.status(500).json({
      error: 'Internal server error',
      details: err.message,
    });
  }
};

module.exports = handler;
