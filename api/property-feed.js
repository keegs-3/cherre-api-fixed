const fetch = (...args) => import('node-fetch').then(({ default: fetch }) => fetch(...args));

module.exports = async (req, res) => {
  const headers = {
    'Authorization': 'Bearer YXBpLWNsaWVudC0xMzg0MWM0MC1hNWNlLTQwZjYtOGM5Ny0wYTIzMmU4ZGU0ZWNAY2hlcnJlLmNvbTpOdUNCJEtYcSVlV3lrSSVnUVY3eTlNczNNbWRzZ0hJUlUwISNCSkM0aFVPWGUzcDI3TjRhRUNac1gyOVFodXZO',  // Your API key
    'Content-Type': 'application/json',
  };

  const endpoint = 'https://graphql.cherre.com/graphql';

  // Function to fetch Cherre data
  const fetchCherre = async (query) => {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query }),
    });
    const { data } = await response.json();
    return data;
  };

  try {
    // Fetching data from the five tables you need
    const [taxAssessorData, taxAssessorBlockData, taxAssessorLotData, taxAssessorOwnerData, usaTaxAssessorHistoryData] = await Promise.all([
      fetchCherre(`{
        Tax_Assessor_V2 {
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
          fl_community_name
          fl_community_nbr
          fl_fema_map_nbr
          fl_firm_id
          fl_panel_nbr
          fl_inside_sfha
          fl_fema_flood_zone
          fl_fema_map_date
          hoa_1_name
          hoa_1_type
          hoa_1_fee_value
          hoa_1_fee_frequency
          hoa_2_name
          hoa_2_type
          hoa_2_fee_value
          hoa_2_fee_frequency
          pfc_flag
          pfc_indicator
          pfc_release_reason
          pfc_transaction_id
          pfc_recording_date
          pfc_document_type
          last_sale_document_type
          prior_sale_date
          last_update_date
          last_sale_date
          cherre_parcel_id
          assessor_snap_shot_year
          tax_assessor_id
          cherre_ingest_datetime
        }
      }`),
      fetchCherre(`{
        Tax_Assessor_Block_V2 {
        cherre_tax_assessor_owner_pk
        owner_name
        owner_first_name
        owner_middle_name
        owner_last_name
        owner_name_suffix
        owner_type
        owner_name_latest_deed
        owner_trust_type_code
        is_owner_company
        ownership_vesting_relation_code
        tax_assessor_id
        cherre_ingest_datetime
        }
      }`),
      fetchCherre(`{
        Tax_Assessor_Lot_V2 {
        cherre_tax_assessor_lot_pk
        lot
        tax_assessor_id
        cherre_ingest_datetime
        }
      }`),
      fetchCherre(`{
        Tax_Assessor_Owner_V2 {
        cherre_tax_assessor_block_pk
        block
        tax_assessor_id
        cherre_ingest_datetime
        }
      }`),
      fetchCherre(`{
        USA_Tax_Assessor_History_V2 {
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
        cherre_deleted_at
        cherre_is_deleted
        property_use_code_mapped
        vacant_flag
        vacant_flag_date
        fl_community_name
        fl_community_nbr
        fl_fema_map_nbr
        fl_firm_id
        fl_panel_nbr
        fl_inside_sfha
        fl_fema_flood_zone
        fl_fema_map_date
        hoa_1_name
        hoa_1_type
        hoa_1_fee_value
        hoa_1_fee_frequency
        hoa_2_name
        hoa_2_type
        hoa_2_fee_value
        hoa_2_fee_frequency
        pfc_flag
        pfc_indicator
        pfc_release_reason
        pfc_transaction_id
        pfc_recording_date
        pfc_document_type
        zone_code
        cherre_assessor_parcel_number_formatted
        last_sale_document_type
        prior_sale_date
        last_update_date
        last_sale_date
        tax_rate
        cherre_ingest_datetime
        }
      }`),
    ]);

    // Merging data based on tax_assessor_id
    const merged = (taxAssessorData.Tax_Assessor_V2 || []).map((taxAssessor) => {
      const { tax_assessor_id } = taxAssessor;
      const relatedBlockData = taxAssessorBlockData.Tax_Assessor_Block_V2.filter(block => block.tax_assessor_id === tax_assessor_id);
      const relatedLotData = taxAssessorLotData.Tax_Assessor_Lot_V2.filter(lot => lot.tax_assessor_id === tax_assessor_id);
      const relatedOwnerData = taxAssessorOwnerData.Tax_Assessor_Owner_V2.filter(owner => owner.tax_assessor_id === tax_assessor_id);
      const relatedHistoryData = usaTaxAssessorHistoryData.USA_Tax_Assessor_History_V2.filter(history => history.tax_assessor_id === tax_assessor_id);

      return {
        ...taxAssessor,
        blocks: relatedBlockData,
        lots: relatedLotData,
        owners: relatedOwnerData,
        history: relatedHistoryData,
      };
    });

    res.status(200).json({ properties: merged });
  } catch (err) {
    console.error('Error fetching Cherre data:', err);
    res.status(500).json({ error: 'Failed to fetch property data.' });
  }
};
