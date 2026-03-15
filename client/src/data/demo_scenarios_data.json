[
  {
    "scenario_id": "DEMO_001",
    "scenario_label": "Clear Accept",
    "scenario_description": "Best LSP is well below benchmark, high reliability, urgent shipment. Straightforward accept.",
    "expected_decision": "ACCEPT",
    "spot_request": {
      "id": "SPOT-DEMO-001",
      "raised_by": "procurement@hectorbeverages.com",
      "raised_at": "2024-03-15T09:20:00",
      "enquiry_date": "2024-03-15",
      "placement_date": "2024-03-15",
      "origin": "Fazilka, Punjab",
      "destination": "Alwar, Rajasthan",
      "truck_type": "15 MT OPENBODY",
      "weight_mt": 15,
      "trucks_required": 1,
      "urgency": "HIGH",
      "dispatch_type": "oneway",
      "contract_tenure": "Spot",
      "cost_threshold": 45000,
      "additional_details": "Fragile FMCG goods, needs careful handling"
    },
    "lane_context": {
      "predicted_rate": 39800,
      "benchmark_rate": 40500,
      "lane_avg_historical": 41200,
      "lane_min_historical": 34000,
      "lane_max_historical": 52000,
      "lane_std_dev": 4200,
      "lane_sample_size": 34,
      "market_demand_index": 0.62,
      "market_note": "Normal demand, adequate supply on this lane"
    },
    "quotes": [
      {
        "quote_id": "Q001-1",
        "lsp": "Atharv Logistics",
        "raw_quote": 38500,
        "transit_days": 2,
        "availability": "Immediate",
        "lsp_profile": {
          "win_rate_pct": 82,
          "neg_gap_pct": 4.1,
          "lane_familiarity_score": 91,
          "on_time_delivery_pct": 94,
          "total_appearances": 56,
          "damage_rate_pct": 0.8
        },
        "scoring": {
          "price_score": 88,
          "reliability_score": 89,
          "urgency_score": 90,
          "market_score": 75,
          "threshold_score": 100,
          "composite": 89
        }
      },
      {
        "quote_id": "Q001-2",
        "lsp": "Shree Ram Transport",
        "raw_quote": 41000,
        "transit_days": 3,
        "availability": "Next Day",
        "lsp_profile": {
          "win_rate_pct": 61,
          "neg_gap_pct": 6.2,
          "lane_familiarity_score": 58,
          "on_time_delivery_pct": 76,
          "total_appearances": 29,
          "damage_rate_pct": 2.1
        },
        "scoring": {
          "price_score": 72,
          "reliability_score": 58,
          "urgency_score": 65,
          "market_score": 75,
          "threshold_score": 95,
          "composite": 71
        }
      },
      {
        "quote_id": "Q001-3",
        "lsp": "FastMove Carriers",
        "raw_quote": 51000,
        "transit_days": 1,
        "availability": "Immediate",
        "lsp_profile": {
          "win_rate_pct": 45,
          "neg_gap_pct": 12.0,
          "lane_familiarity_score": 31,
          "on_time_delivery_pct": 88,
          "total_appearances": 18,
          "damage_rate_pct": 1.2
        },
        "scoring": {
          "price_score": 18,
          "reliability_score": 65,
          "urgency_score": 100,
          "market_score": 75,
          "threshold_score": 20,
          "composite": 51
        }
      }
    ],
    "negotiate_target_price": null,
    "ai_recommendation": {
      "recommendation": "ACCEPT",
      "target_lsp": "Atharv Logistics",
      "confidence": 0.91,
      "negotiate_target_price": null,
      "reasoning": "Atharv Logistics scores 89/100 and quotes Rs.38,500 which is 3.3% below the predicted market rate of Rs.39,800 and well within the Rs.45,000 threshold. With a 94% on-time delivery rate and 82% win rate on this lane, they represent the clear optimal choice. No negotiation needed \u2014 this is a straightforward accept.",
      "key_risk": "Confirm same-day placement window as the shipment has HIGH urgency and delayed confirmation may lose the truck availability slot."
    }
  },
  {
    "scenario_id": "DEMO_002",
    "scenario_label": "Negotiate \u2014 Low Price, Risky LSP",
    "scenario_description": "Cheapest LSP has poor OTD and low win rate. Best reliable LSP is 8% over benchmark. Negotiate down.",
    "expected_decision": "NEGOTIATE",
    "spot_request": {
      "id": "SPOT-DEMO-002",
      "raised_by": "logistics@mahindra.com",
      "raised_at": "2024-03-16T11:45:00",
      "enquiry_date": "2024-03-16",
      "placement_date": "2024-03-17",
      "origin": "Pune, Maharashtra",
      "destination": "Nagpur, Maharashtra",
      "truck_type": "20 MT CONTAINER",
      "weight_mt": 18,
      "trucks_required": 2,
      "urgency": "MEDIUM",
      "dispatch_type": "oneway",
      "contract_tenure": "Spot",
      "cost_threshold": 55000,
      "additional_details": "Auto components, 2 trucks required same day"
    },
    "lane_context": {
      "predicted_rate": 48200,
      "benchmark_rate": 49000,
      "lane_avg_historical": 49800,
      "lane_min_historical": 41000,
      "lane_max_historical": 61000,
      "lane_std_dev": 5800,
      "lane_sample_size": 67,
      "market_demand_index": 0.71,
      "market_note": "Moderate demand pressure, limited 20MT availability this week"
    },
    "quotes": [
      {
        "quote_id": "Q002-1",
        "lsp": "Rajdhani Freight",
        "raw_quote": 44000,
        "transit_days": 2,
        "availability": "Next Day",
        "lsp_profile": {
          "win_rate_pct": 38,
          "neg_gap_pct": 2.0,
          "lane_familiarity_score": 28,
          "on_time_delivery_pct": 61,
          "total_appearances": 13,
          "damage_rate_pct": 4.8
        },
        "scoring": {
          "price_score": 95,
          "reliability_score": 28,
          "urgency_score": 70,
          "market_score": 60,
          "threshold_score": 100,
          "composite": 69
        }
      },
      {
        "quote_id": "Q002-2",
        "lsp": "VRL Logistics",
        "raw_quote": 52800,
        "transit_days": 1,
        "availability": "Immediate",
        "lsp_profile": {
          "win_rate_pct": 79,
          "neg_gap_pct": 7.8,
          "lane_familiarity_score": 88,
          "on_time_delivery_pct": 93,
          "total_appearances": 74,
          "damage_rate_pct": 0.6
        },
        "scoring": {
          "price_score": 52,
          "reliability_score": 91,
          "urgency_score": 100,
          "market_score": 60,
          "threshold_score": 72,
          "composite": 73
        }
      },
      {
        "quote_id": "Q002-3",
        "lsp": "Gati Express",
        "raw_quote": 57000,
        "transit_days": 2,
        "availability": "Immediate",
        "lsp_profile": {
          "win_rate_pct": 55,
          "neg_gap_pct": 9.2,
          "lane_familiarity_score": 62,
          "on_time_delivery_pct": 84,
          "total_appearances": 41,
          "damage_rate_pct": 1.4
        },
        "scoring": {
          "price_score": 35,
          "reliability_score": 74,
          "urgency_score": 70,
          "market_score": 60,
          "threshold_score": 45,
          "composite": 55
        }
      },
      {
        "quote_id": "Q002-4",
        "lsp": "Navata Road Transport",
        "raw_quote": 60000,
        "transit_days": 3,
        "availability": "Next Day",
        "lsp_profile": {
          "win_rate_pct": 48,
          "neg_gap_pct": 5.5,
          "lane_familiarity_score": 44,
          "on_time_delivery_pct": 79,
          "total_appearances": 22,
          "damage_rate_pct": 1.9
        },
        "scoring": {
          "price_score": 22,
          "reliability_score": 62,
          "urgency_score": 55,
          "market_score": 60,
          "threshold_score": 30,
          "composite": 45
        }
      }
    ],
    "negotiate_target_price": 49400,
    "ai_recommendation": {
      "recommendation": "NEGOTIATE",
      "target_lsp": "VRL Logistics",
      "confidence": 0.79,
      "negotiate_target_price": 49400,
      "reasoning": "Rajdhani Freight quotes lowest at Rs.44,000 but their 61% OTD rate and 4.8% damage rate pose serious risk for auto components requiring 2-truck same-day dispatch. VRL Logistics scores highest at 73/100 with 93% OTD and 79% win rate, but their Rs.52,800 quote is 8.2% above benchmark. Their historical negotiation gap of 7.8% suggests they will accept Rs.49,400, which is within threshold.",
      "key_risk": "VRL's 1-day transit requires immediate confirmation \u2014 their Immediate availability is time-sensitive and may lapse if negotiation extends beyond 2 hours."
    }
  },
  {
    "scenario_id": "DEMO_003",
    "scenario_label": "Reject All \u2014 Overpriced Market",
    "scenario_description": "All quotes are significantly above threshold and benchmark. Low urgency means re-tendering tomorrow is viable.",
    "expected_decision": "REJECT",
    "spot_request": {
      "id": "SPOT-DEMO-003",
      "raised_by": "supply@itcltd.com",
      "raised_at": "2024-03-17T14:10:00",
      "enquiry_date": "2024-03-17",
      "placement_date": "2024-03-19",
      "origin": "Kolkata, West Bengal",
      "destination": "Patna, Bihar",
      "truck_type": "15 MT OPENBODY",
      "weight_mt": 14,
      "trucks_required": 1,
      "urgency": "LOW",
      "dispatch_type": "oneway",
      "contract_tenure": "Spot",
      "cost_threshold": 28000,
      "additional_details": "Non-perishable goods, 2-day placement window available"
    },
    "lane_context": {
      "predicted_rate": 26500,
      "benchmark_rate": 27200,
      "lane_avg_historical": 27800,
      "lane_min_historical": 22000,
      "lane_max_historical": 35000,
      "lane_std_dev": 3100,
      "lane_sample_size": 48,
      "market_demand_index": 0.88,
      "market_note": "High demand spike \u2014 festival season surge. Rates expected to normalize in 48 hours."
    },
    "quotes": [
      {
        "quote_id": "Q003-1",
        "lsp": "Bengal Express",
        "raw_quote": 36500,
        "transit_days": 2,
        "availability": "Immediate",
        "lsp_profile": {
          "win_rate_pct": 52,
          "neg_gap_pct": 5.0,
          "lane_familiarity_score": 70,
          "on_time_delivery_pct": 81,
          "total_appearances": 33,
          "damage_rate_pct": 1.7
        },
        "scoring": {
          "price_score": 15,
          "reliability_score": 71,
          "urgency_score": 40,
          "market_score": 25,
          "threshold_score": 10,
          "composite": 31
        }
      },
      {
        "quote_id": "Q003-2",
        "lsp": "Eastern Carriers",
        "raw_quote": 34000,
        "transit_days": 3,
        "availability": "Next Day",
        "lsp_profile": {
          "win_rate_pct": 44,
          "neg_gap_pct": 4.2,
          "lane_familiarity_score": 55,
          "on_time_delivery_pct": 77,
          "total_appearances": 27,
          "damage_rate_pct": 2.3
        },
        "scoring": {
          "price_score": 22,
          "reliability_score": 62,
          "urgency_score": 40,
          "market_score": 25,
          "threshold_score": 15,
          "composite": 33
        }
      },
      {
        "quote_id": "Q003-3",
        "lsp": "Zoom Logistics",
        "raw_quote": 39000,
        "transit_days": 1,
        "availability": "Immediate",
        "lsp_profile": {
          "win_rate_pct": 29,
          "neg_gap_pct": 8.5,
          "lane_familiarity_score": 22,
          "on_time_delivery_pct": 69,
          "total_appearances": 11,
          "damage_rate_pct": 3.9
        },
        "scoring": {
          "price_score": 8,
          "reliability_score": 41,
          "urgency_score": 40,
          "market_score": 25,
          "threshold_score": 5,
          "composite": 24
        }
      }
    ],
    "negotiate_target_price": null,
    "ai_recommendation": {
      "recommendation": "REJECT",
      "target_lsp": null,
      "confidence": 0.88,
      "negotiate_target_price": null,
      "reasoning": "All three quotes (Rs.34,000\u201339,000) are 21\u201339% above the Rs.28,000 cost threshold and significantly exceed the predicted rate of Rs.26,500. The market demand index of 0.88 confirms a temporary festival-season surge. With LOW urgency and a 2-day placement window available, re-tendering in 48 hours when demand normalizes is strongly recommended.",
      "key_risk": "If re-tendering, set a 24-hour deadline on the new enquiry to prevent the placement date from slipping beyond the buffer window."
    }
  },
  {
    "scenario_id": "DEMO_004",
    "scenario_label": "Negotiate \u2014 New LSP, No History",
    "scenario_description": "Cheapest quote is from a new transporter with no history in the dataset. Agent flags limited data and recommends negotiate with performance clause.",
    "expected_decision": "NEGOTIATE",
    "spot_request": {
      "id": "SPOT-DEMO-004",
      "raised_by": "ops@dabur.com",
      "raised_at": "2024-03-18T08:30:00",
      "enquiry_date": "2024-03-18",
      "placement_date": "2024-03-18",
      "origin": "Baddi, Himachal Pradesh",
      "destination": "Delhi NCR, Delhi",
      "truck_type": "10 MT CONTAINER",
      "weight_mt": 9,
      "trucks_required": 3,
      "urgency": "HIGH",
      "dispatch_type": "oneway",
      "contract_tenure": "Spot",
      "cost_threshold": 32000,
      "additional_details": "Pharma goods, temperature not controlled but must be covered"
    },
    "lane_context": {
      "predicted_rate": 29400,
      "benchmark_rate": 30100,
      "lane_avg_historical": 30800,
      "lane_min_historical": 25000,
      "lane_max_historical": 38000,
      "lane_std_dev": 3600,
      "lane_sample_size": 52,
      "market_demand_index": 0.58,
      "market_note": "Normal conditions. Adequate supply on Baddi-Delhi corridor."
    },
    "quotes": [
      {
        "quote_id": "Q004-1",
        "lsp": "HillRoute Movers",
        "raw_quote": 26500,
        "transit_days": 2,
        "availability": "Immediate",
        "lsp_profile": {
          "win_rate_pct": 50,
          "neg_gap_pct": 8.0,
          "lane_familiarity_score": 20,
          "on_time_delivery_pct": 50,
          "total_appearances": 0,
          "damage_rate_pct": 0,
          "is_new_lsp": true,
          "new_lsp_note": "No historical data found in dataset. Default neutral scores applied."
        },
        "scoring": {
          "price_score": 100,
          "reliability_score": 50,
          "urgency_score": 85,
          "market_score": 70,
          "threshold_score": 100,
          "composite": 79,
          "data_confidence": "LOW"
        }
      },
      {
        "quote_id": "Q004-2",
        "lsp": "Patel Roadways",
        "raw_quote": 31000,
        "transit_days": 2,
        "availability": "Immediate",
        "lsp_profile": {
          "win_rate_pct": 74,
          "neg_gap_pct": 5.5,
          "lane_familiarity_score": 82,
          "on_time_delivery_pct": 91,
          "total_appearances": 61,
          "damage_rate_pct": 0.9,
          "is_new_lsp": false
        },
        "scoring": {
          "price_score": 72,
          "reliability_score": 88,
          "urgency_score": 85,
          "market_score": 70,
          "threshold_score": 90,
          "composite": 81,
          "data_confidence": "HIGH"
        }
      },
      {
        "quote_id": "Q004-3",
        "lsp": "Swift Logistics",
        "raw_quote": 34500,
        "transit_days": 1,
        "availability": "Immediate",
        "lsp_profile": {
          "win_rate_pct": 60,
          "neg_gap_pct": 6.8,
          "lane_familiarity_score": 66,
          "on_time_delivery_pct": 86,
          "total_appearances": 38,
          "damage_rate_pct": 1.3,
          "is_new_lsp": false
        },
        "scoring": {
          "price_score": 52,
          "reliability_score": 78,
          "urgency_score": 100,
          "market_score": 70,
          "threshold_score": 68,
          "composite": 72,
          "data_confidence": "HIGH"
        }
      },
      {
        "quote_id": "Q004-4",
        "lsp": "Agarwal Packers",
        "raw_quote": 38000,
        "transit_days": 2,
        "availability": "Next Day",
        "lsp_profile": {
          "win_rate_pct": 42,
          "neg_gap_pct": 10.2,
          "lane_familiarity_score": 48,
          "on_time_delivery_pct": 73,
          "total_appearances": 19,
          "damage_rate_pct": 2.8,
          "is_new_lsp": false
        },
        "scoring": {
          "price_score": 32,
          "reliability_score": 58,
          "urgency_score": 85,
          "market_score": 70,
          "threshold_score": 42,
          "composite": 55,
          "data_confidence": "MEDIUM"
        }
      }
    ],
    "negotiate_target_price": 28500,
    "ai_recommendation": {
      "recommendation": "NEGOTIATE",
      "target_lsp": "Patel Roadways",
      "confidence": 0.82,
      "negotiate_target_price": 28500,
      "reasoning": "HillRoute Movers quotes the lowest at Rs.26,500 but has zero historical data \u2014 their reliability score is a neutral default, not a real assessment, making them high risk for a HIGH urgency pharma shipment of 3 trucks. Patel Roadways scores 81/100 with 91% OTD and 74% win rate on this corridor. Their Rs.31,000 quote is 5.5% above benchmark but their 5.5% historical negotiation gap supports a target of Rs.28,500.",
      "key_risk": "Do not use HillRoute Movers for pharma goods without a minimum 2-trip performance history \u2014 the lack of data is not a green signal, it is an unknown risk."
    }
  },
  {
    "scenario_id": "DEMO_005",
    "scenario_label": "Accept \u2014 Multi-Truck, High Stakes",
    "scenario_description": "5 trucks needed, high value load. One LSP clearly dominates on both price and reliability. Clear accept despite being slightly above predicted.",
    "expected_decision": "ACCEPT",
    "spot_request": {
      "id": "SPOT-DEMO-005",
      "raised_by": "freight@asianpaints.com",
      "raised_at": "2024-03-19T10:00:00",
      "enquiry_date": "2024-03-19",
      "placement_date": "2024-03-20",
      "origin": "Rohtak, Haryana",
      "destination": "Jaipur, Rajasthan",
      "truck_type": "15 MT OPENBODY",
      "weight_mt": 15,
      "trucks_required": 5,
      "urgency": "HIGH",
      "dispatch_type": "oneway",
      "contract_tenure": "Spot",
      "cost_threshold": 42000,
      "additional_details": "Paint materials, 5 trucks must depart together as a convoy"
    },
    "lane_context": {
      "predicted_rate": 37600,
      "benchmark_rate": 38400,
      "lane_avg_historical": 38900,
      "lane_min_historical": 31000,
      "lane_max_historical": 48000,
      "lane_std_dev": 4100,
      "lane_sample_size": 41,
      "market_demand_index": 0.65,
      "market_note": "Stable market. 5-truck convoy availability is the key constraint."
    },
    "quotes": [
      {
        "quote_id": "Q005-1",
        "lsp": "National Carriers",
        "raw_quote": 39500,
        "transit_days": 2,
        "availability": "Immediate",
        "trucks_available": 5,
        "lsp_profile": {
          "win_rate_pct": 85,
          "neg_gap_pct": 3.8,
          "lane_familiarity_score": 94,
          "on_time_delivery_pct": 96,
          "total_appearances": 88,
          "damage_rate_pct": 0.4
        },
        "scoring": {
          "price_score": 78,
          "reliability_score": 95,
          "urgency_score": 90,
          "market_score": 68,
          "threshold_score": 92,
          "composite": 85
        }
      },
      {
        "quote_id": "Q005-2",
        "lsp": "Safexpress",
        "raw_quote": 36000,
        "transit_days": 3,
        "availability": "Partial \u2014 3 trucks only",
        "trucks_available": 3,
        "lsp_profile": {
          "win_rate_pct": 58,
          "neg_gap_pct": 5.1,
          "lane_familiarity_score": 60,
          "on_time_delivery_pct": 82,
          "total_appearances": 36,
          "damage_rate_pct": 1.6
        },
        "scoring": {
          "price_score": 88,
          "reliability_score": 68,
          "urgency_score": 55,
          "market_score": 68,
          "threshold_score": 100,
          "composite": 74,
          "availability_flag": "PARTIAL \u2014 cannot fulfill 5 truck requirement"
        }
      },
      {
        "quote_id": "Q005-3",
        "lsp": "TCI Freight",
        "raw_quote": 44500,
        "transit_days": 2,
        "availability": "Immediate",
        "trucks_available": 5,
        "lsp_profile": {
          "win_rate_pct": 62,
          "neg_gap_pct": 7.2,
          "lane_familiarity_score": 71,
          "on_time_delivery_pct": 87,
          "total_appearances": 44,
          "damage_rate_pct": 1.1
        },
        "scoring": {
          "price_score": 48,
          "reliability_score": 76,
          "urgency_score": 90,
          "market_score": 68,
          "threshold_score": 58,
          "composite": 67
        }
      },
      {
        "quote_id": "Q005-4",
        "lsp": "Mahavir Transport",
        "raw_quote": 48000,
        "transit_days": 2,
        "availability": "Immediate",
        "trucks_available": 5,
        "lsp_profile": {
          "win_rate_pct": 39,
          "neg_gap_pct": 9.8,
          "lane_familiarity_score": 38,
          "on_time_delivery_pct": 72,
          "total_appearances": 16,
          "damage_rate_pct": 3.1
        },
        "scoring": {
          "price_score": 28,
          "reliability_score": 54,
          "urgency_score": 90,
          "market_score": 68,
          "threshold_score": 35,
          "composite": 51
        }
      },
      {
        "quote_id": "Q005-5",
        "lsp": "Blue Dart Surface",
        "raw_quote": 52000,
        "transit_days": 1,
        "availability": "Immediate",
        "trucks_available": 5,
        "lsp_profile": {
          "win_rate_pct": 71,
          "neg_gap_pct": 6.0,
          "lane_familiarity_score": 55,
          "on_time_delivery_pct": 91,
          "total_appearances": 29,
          "damage_rate_pct": 0.7
        },
        "scoring": {
          "price_score": 18,
          "reliability_score": 85,
          "urgency_score": 100,
          "market_score": 68,
          "threshold_score": 20,
          "composite": 54
        }
      }
    ],
    "negotiate_target_price": null,
    "ai_recommendation": {
      "recommendation": "ACCEPT",
      "target_lsp": "National Carriers",
      "confidence": 0.87,
      "negotiate_target_price": null,
      "reasoning": "National Carriers scores 85/100 \u2014 the only LSP able to fulfill the full 5-truck convoy requirement immediately. Safexpress quotes lower but can only provide 3 trucks, disqualifying them. National Carriers' 96% OTD and 88 lane familiarity score make them the clear choice at Rs.39,500, which is within threshold and only 5% above predicted rate \u2014 an acceptable premium for guaranteed convoy availability.",
      "key_risk": "Convoy coordination requires a single departure confirmation \u2014 ensure National Carriers' 5-truck availability is confirmed in writing before acceptance to prevent partial fulfillment."
    }
  },
  {
    "scenario_id": "DEMO_006",
    "scenario_label": "Negotiate \u2014 Two Strong LSPs, Tight Spread",
    "scenario_description": "Two LSPs very close in composite score. Neither is a clear accept. Agent recommends negotiating the better-reliability one down to a target price to break the tie.",
    "expected_decision": "NEGOTIATE",
    "spot_request": {
      "id": "SPOT-DEMO-006",
      "raised_by": "logistics@britannia.com",
      "raised_at": "2024-03-20T13:55:00",
      "enquiry_date": "2024-03-20",
      "placement_date": "2024-03-21",
      "origin": "Ranjangaon, Maharashtra",
      "destination": "Hyderabad, Telangana",
      "truck_type": "20 MT CONTAINER",
      "weight_mt": 19,
      "trucks_required": 1,
      "urgency": "MEDIUM",
      "dispatch_type": "oneway",
      "contract_tenure": "Spot",
      "cost_threshold": 68000,
      "additional_details": "Biscuit consignment, must be in covered container, no rain exposure"
    },
    "lane_context": {
      "predicted_rate": 61400,
      "benchmark_rate": 62800,
      "lane_avg_historical": 63500,
      "lane_min_historical": 53000,
      "lane_max_historical": 79000,
      "lane_std_dev": 7200,
      "lane_sample_size": 29,
      "market_demand_index": 0.74,
      "market_note": "Above average demand on this corridor. Limited 20MT container availability."
    },
    "quotes": [
      {
        "quote_id": "Q006-1",
        "lsp": "Spoton Logistics",
        "raw_quote": 64000,
        "transit_days": 2,
        "availability": "Immediate",
        "lsp_profile": {
          "win_rate_pct": 76,
          "neg_gap_pct": 5.8,
          "lane_familiarity_score": 80,
          "on_time_delivery_pct": 92,
          "total_appearances": 52,
          "damage_rate_pct": 0.7
        },
        "scoring": {
          "price_score": 62,
          "reliability_score": 88,
          "urgency_score": 70,
          "market_score": 55,
          "threshold_score": 85,
          "composite": 73
        }
      },
      {
        "quote_id": "Q006-2",
        "lsp": "Delhivery Surface",
        "raw_quote": 61500,
        "transit_days": 2,
        "availability": "Immediate",
        "lsp_profile": {
          "win_rate_pct": 69,
          "neg_gap_pct": 4.2,
          "lane_familiarity_score": 74,
          "on_time_delivery_pct": 88,
          "total_appearances": 45,
          "damage_rate_pct": 1.0
        },
        "scoring": {
          "price_score": 70,
          "reliability_score": 82,
          "urgency_score": 70,
          "market_score": 55,
          "threshold_score": 92,
          "composite": 74
        }
      },
      {
        "quote_id": "Q006-3",
        "lsp": "Xpressbees Surface",
        "raw_quote": 72000,
        "transit_days": 1,
        "availability": "Immediate",
        "lsp_profile": {
          "win_rate_pct": 55,
          "neg_gap_pct": 8.9,
          "lane_familiarity_score": 48,
          "on_time_delivery_pct": 85,
          "total_appearances": 21,
          "damage_rate_pct": 1.5
        },
        "scoring": {
          "price_score": 38,
          "reliability_score": 72,
          "urgency_score": 100,
          "market_score": 55,
          "threshold_score": 62,
          "composite": 61
        }
      },
      {
        "quote_id": "Q006-4",
        "lsp": "Rivigo",
        "raw_quote": 78500,
        "transit_days": 1,
        "availability": "Immediate",
        "lsp_profile": {
          "win_rate_pct": 48,
          "neg_gap_pct": 11.5,
          "lane_familiarity_score": 35,
          "on_time_delivery_pct": 90,
          "total_appearances": 14,
          "damage_rate_pct": 0.5
        },
        "scoring": {
          "price_score": 18,
          "reliability_score": 78,
          "urgency_score": 100,
          "market_score": 55,
          "threshold_score": 38,
          "composite": 52
        }
      }
    ],
    "negotiate_target_price": 60200,
    "ai_recommendation": {
      "recommendation": "NEGOTIATE",
      "target_lsp": "Spoton Logistics",
      "confidence": 0.76,
      "negotiate_target_price": 60200,
      "reasoning": "Spoton Logistics and Delhivery Surface are separated by only 1 composite point (73 vs 74), but Spoton's superior OTD of 92% vs 88% and lower damage rate of 0.7% vs 1.0% make them the preferred choice for covered container biscuit shipments. Spoton's quote of Rs.64,000 is 4.2% above predicted rate. Their 5.8% historical negotiation gap strongly supports a target of Rs.60,200, which matches the predicted rate.",
      "key_risk": "If Spoton rejects the negotiation target, fall back to Delhivery Surface at their quoted Rs.61,500 \u2014 do not counter-negotiate upward as it sets a poor precedent."
    }
  }
]