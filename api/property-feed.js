const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

module.exports = async (req, res) => {
  const headers = {
    'Authorization': 'Bearer YXBpLWNsaWVudC0xMzg0MWM0MC1hNWNlLTQwZjYtOGM5Ny0wYTIzMmU4ZGU0ZWNAY2hlcnJlLmNvbTpOdUNCJEtYcSVlV3lrSSVnUVY3eTlNczNNbWRzZ0hJUlUwISNCSkM0aFVPWGUzcDI3TjRhRUNac1gyOVFodXZO',
    'Content-Type': 'application/json',
  };

  const endpoint = 'https://graphql.cherre.com/graphql';

  const fetchCherre = async (query) => {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query }),
    });

    const result = await response.json();
    if (!result || result.errors) {
      console.error("❌ Cherre Error:", JSON.stringify(result.errors, null, 2));
      throw new Error("Cherre query failed");
    }
    return result.data;
  };

  try {
    const [taxAssessorData, taxAssessorBlockData, taxAssessorLotData, taxAssessorOwnerData, usaTaxAssessorHistoryData] = await Promise.all([
      fetchCherre(`{ tax_assessor_v2(limit: 50) {
        tax_assessor_id
        situs_state
        situs_county
        jurisdiction
        fips_code
        cbsa_name
        cbsa_code
        msa_name
        msa_code
        metro_division
        neighborhood_code
        census_tract
        census_block_group
        census_block
        assessor_parcel_number_raw
        alternate_assessor_parcel_number
        account_number
        address
        house_number
        street_direction
        street_name
        street_suffix
        street_post_direction
        unit_prefix
        unit_number
        city
        state
        zip
        zip_4
        crrt
        latitude
        longitude
        geocode_quality_code
        description
        range
        township
        section
        quarter
        quarter_quarter
        subdivision
        phase
        tract
        legal_unit_number
        mailing_county
        mailing_fips_code
        mailing_address
        mailing_house_number
        mailing_street_direction
        mailing_street_name
        mailing_street_suffix
        mailing_street_post_direction
        mailing_unit_prefix
        mailing_unit_number
        mailing_city
        mailing_state
        mailing_zip
        mailing_zip_4
        mailing_crrt
        is_owner_occupied
        assessed_tax_year
        assessed_value_total
        assessed_value_improvements
        assessed_value_land
        assessed_improvements_percent
        market_value_year
        market_value_total
        market_value_improvements
        the_value_land
        market_improvements_percent
        fiscal_year
        tax_bill_amount
        tax_delinquent_year
        is_homeowner_exemption
        is_disabled_exemption
        is_senior_exemption
        is_veteran_exemption
        is_widow_exemption
        is_additional_exemption
        year_built
        effective_year_built
        zone_code
        property_group_type
        property_use_standardized_code
        last_sale_amount
        prior_sale_amount
        deed_last_sale_document_book
        deed_last_sale_document_page
        deed_last_sale_document_number
        building_sq_ft
        building_sq_ft_code
        gross_sq_ft
        floor_1_sq_ft
        lot_size_acre
        lot_size_sq_ft
        lot_depth_ft
        lot_width
        attic_sq_ft
        has_attic
        basement_sq_ft
        basement_finished_sq_ft
        basement_unfinished_sq_ft
        parking_garage_code
        parking_sq_ft
        has_parking_carport
        hvacc_cooling_code
        hvacc_heating_code
        hvacc_heating_fuel_code
        sewer_usage_code
        water_source_code
        has_mobile_home_hookup
        foundation_code
        construction_code
        interior_structure_code
        plumbing_feature_count
        has_fire_sprinkers
        flooring_material_code
        bath_count
        partial_bath_count
        bed_count
        room_count
        stories_count
        units_count
        has_bonus_room
        has_breakfast_nook
        has_cellar
        has_wine_cellar
        has_exercise_room
        has_family_room
        has_game_room
        has_great_room
        has_hobby_room
        has_laundry_room
        has_media_room
        has_mud_room
        has_home_office
        has_safe_room
        has_sitting_room
        has_storm_shelter
        has_study
        has_sunroom
        has_utility_room
        fireplace_count
        has_elevator
        is_handicap_accessible
        has_central_vacuum_system
        has_intercom
        has_installed_sound_system
        has_wet_bar
        has_alarm_system
        structure_style_code
        exterior_code
        roof_material_code
        roof_construction_code
        has_storm_shutter
        has_overhead_door
        view_code
        porch_code
        has_deck
        has_rv_parking
        parking_space_count
        driveway_material_code
        pool_code
        has_sauna
        topography_code
        has_arbor_pergola
        has_sprinklers
        has_golf_course_green
        has_tennis_court
        has_other_sport_court
        has_water_feature
        has_boat_lift
        buildings_count
        has_boat_access
        has_outdoor_kitchen_fireplace
        data_publish_date
        property_use_code_mapped
        vacant_flag
        vacant_flag_date
        last_sale_date
        cherre_ingest_datetime
      } }`),
      fetchCherre(`{ tax_assessor_block_v2(limit: 50) {
        tax_assessor_id
        cherre_tax_assessor_block_pk
        block
        cherre_ingest_datetime
      } }`),
      fetchCherre(`{ tax_assessor_lot_v2(limit: 50) {
        tax_assessor_id
        cherre_tax_assessor_lot_pk
        lot
        cherre_ingest_datetime
      } }`),
      fetchCherre(`{ tax_assessor_owner_v2(limit: 50) {
        tax_assessor_id
        cherre_tax_assessor_owner_pk
        owner_name
        owner_first_name
        owner_last_name
        owner_type
        is_owner_company
        cherre_ingest_datetime
      } 
      }`),
    ]);

    const merged = (taxAssessorData?.tax_assessor_v2 || []).map((taxAssessor) => {
      const id = taxAssessor.tax_assessor_id;
      return {
        ...taxAssessor,
        blocks: taxAssessorBlockData?.tax_assessor_block_v2?.filter(b => b.tax_assessor_id === id) || [],
        lots: taxAssessorLotData?.tax_assessor_lot_v2?.filter(l => l.tax_assessor_id === id) || [],
        owners: taxAssessorOwnerData?.tax_assessor_owner_v2?.filter(o => o.tax_assessor_id === id) || [],
      };
    });

    console.log("✅ Merged result:", JSON.stringify(merged.slice(0, 3), null, 2)); // preview first 3
    res.status(200).json({ properties: merged });
  } catch (err) {
    console.error("❌ Server Error:", err.message, err.stack);
    res.status(500).json({ error: 'Failed to fetch property data.' });
  }
};
