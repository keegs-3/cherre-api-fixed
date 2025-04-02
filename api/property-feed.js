const fetch = require('node-fetch');

const AUTH_TOKEN = 'Bearer YXBpLWNsaWVudC0xMzg0MWM0MC1hNWNlLTQwZjYtOGM5Ny0wYTIzMmU4ZGU0ZWNAY2hlcnJlLmNvbTpOdUNCJEtYcSVlV3lrSSVnUVY3eTlNczNNbWRzZ0hJUlUwISNCSkM0aFVPWGUzcDI3TjRhRUNac1gyOVFodXZO';

const handler = async (req, res) => {
  const query = `
    query {
      tax_assessor_v2(limit: 100) {
        tax_assessor_id
        property_address
        property_city
        property_state
        property_zip
        building_area_sq_ft
        land_area_acres
        year_built
        zoning_code
        property_type
        owner_occupied
        last_sale_price
        last_sale_date
        assessed_value
        market_value

        tax_assessor_block_v2 {
          block_number
          block_type
          block_status
        }

        tax_assessor_lot_v2 {
          lot_number
          lot_size_sq_ft
          lot_type
          lot_status
        }

        tax_assessor_owner_v2 {
          owner_name
          owner_type
          ownership_percent
          mailing_address
          is_primary_owner
        }

        usa_tax_assessor_history_v2 {
          assessment_year
          assessed_value
          market_value
          tax_amount
          exemption_description
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

    const result = await response.json();
    console.log('[Cherre DEBUG]:', JSON.stringify(result, null, 2));

    if (result.errors) {
      return res.status(500).json({
        error: 'GraphQL query failed',
        details: result.errors,
      });
    }

    return res.status(200).json(result.data.tax_assessor_v2 || []);
  } catch (err) {
    return res.status(500).json({
      error: 'Internal server error',
      details: err.message,
    });
  }
};

module.exports = handler;
