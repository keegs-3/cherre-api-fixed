const fetch = require('node-fetch');

const AUTH_TOKEN = 'Bearer YXBpLWNsaWVudC0xMzg0MWM0MC1hNWNlLTQwZjYtOGM5Ny0wYTIzMmU4ZGU0ZWNAY2hlcnJlLmNvbTpOdUNCJEtYcSVlV3lrSSVnUVY3eTlNczNNbWRzZ0hJUlUwISNCSkM0aFVPWGUzcDI3TjRhRUNac1gyOVFodXZO';

const handler = async (req, res) => {
  const query = `
    query {
      tax_assessor_v2(limit: 100) {
        tax_assessor_id
        zoning_code
        year_built
        building_area_sq_ft
        land_area_acres
        last_sale_price
        last_sale_date
        property_type
        owner_occupied

        tax_assessor_block_v2 {
          block_number
          block_type
        }

        tax_assessor_lot_v2 {
          lot_number
          lot_size_sq_ft
        }

        tax_assessor_owner_v2 {
          owner_name
          owner_type
        }

        usa_tax_assessor_history_v2 {
          assessment_year
          tax_amount
        }
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

    const text = await response.text();
    console.log('[RAW CHERRE RESPONSE]', text);

    let json;
    try {
      json = JSON.parse(text);
    } catch (err) {
      return res.status(500).json({ error: 'Failed to parse JSON', raw: text });
    }

    if (json.errors) {
      return res.status(500).json({ error: 'GraphQL query failed', details: json.errors });
    }

    return res.status(200).json(json.data.tax_assessor_v2 || []);
  } catch (err) {
    console.error('[CRASH]', err);
    return res.status(500).json({
      error: 'Serverless function crashed',
      details: err.message,
    });
  }
};

module.exports = handler;
