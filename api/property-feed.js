const handler = async (req, res) => {
  const query = `
    query {
      tax_assessor_v2(limit: 10) {
        tax_assessor_id
      }
    }
  `;

  try {
    const response = await fetch('https://graphql.cherre.com/graphql', {
      method: 'POST',
      headers: {
        'Authorization': 'YXBpLWNsaWVudC0xMzg0MWM0MC1hNWNlLTQwZjYtOGM5Ny0wYTIzMmU4ZGU0ZWNAY2hlcnJlLmNvbTpOdUNCJEtYcSVlV3lrSSVnUVY3eTlNczNNbWRzZ0hJUlUwISNCSkM0aFVPWGUzcDI3TjRhRUNac1gyOVFodXZO',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ query })
    });

    const result = await response.json();
    console.log('[Cherre Result]', JSON.stringify(result, null, 2));

    if (result.errors) {
      return res.status(500).json({ error: 'GraphQL query failed', details: result.errors });
    }

    return res.status(200).json(result.data.tax_assessor_v2 || []);
  } catch (err) {
    return res.status(500).json({ error: 'Internal error', details: err.message });
  }
};

