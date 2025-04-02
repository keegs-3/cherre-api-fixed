// File: /api/property-feed.js

const fetch = require('node-fetch');

const CHERRE_API = 'https://graphql.cherre.com/graphql';
const AUTH_TOKEN = 'Bearer YXBpLWNsaWVudC0xMzg0MWM0MC1hNWNlLTQwZjYtOGM5Ny0wYTIzMmU4ZGU0ZWNAY2hlcnJlLmNvbTpOdUNCJEtYcSVlV3lrSSVnUVY3eTlNczNNbWRzZ0hJUlUwISNCSkM0aFVPWGUzcDI3TjRhRUNac1gyOVFodXZO';

const handler = async (req, res) => {
  const query = `
    query {
      tax_assessor_v2(limit: 100) {
        tax_assessor_id
        apn
        state
        county
        parcel_number
        address
        latitude
        longitude
        year_built
        building_area_sq_ft
        bedrooms
        bathrooms
        property_type
        land_area_sq_ft
        assessed_value
        market_value
        last_sale_price
        last_sale_date
        mailing_address
        owner_occupied
        zoning

        tax_assessor_block_v2 {
          block_number
          block_type
          block_description
        }

        tax_assessor_lot_v2 {
          lot_number
          lot_size_sq_ft
          lot_type
          lot_description
        }

        tax_assessor_owner_v2 {
          owner_name
          owner_type
          owner_percent
          owner_mailing_address
          is_primary_owner
        }

        usa_tax_assessor_history_v2 {
          year
          assessed_value
          market_value
          tax_amount
          exemption
        }
      }
    }
  `;

  try {
    const response = await fetch(CHERRE_API, {
      method: 'POST',
      headers: {
        'Authorization': AUTH_TOKEN,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query })
    });

    const { data, errors } = await response.json();

    if (errors) {
      console.error('GraphQL Errors:', errors);
      return res.status(500).json({ error: 'GraphQL query failed', details: errors });
    }

    res.status(200).json(data.tax_assessor_v2);
  } catch (err) {
    console.error('API Error:', err);
    res.status(500).json({ error: 'Internal server error', details: err.message });
  }
};

module.exports = handler;
