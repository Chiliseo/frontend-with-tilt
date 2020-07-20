// Kari Barry - January 12th 2020
// Agnostic search method for to infer country from regional information
'use strict';

var countries = [
    {
        "id": 1,
        countryName: 'United States',
        countryCode: 'USA',
        countryRef:
            'https://api-na.myconnectwise.net/v4_6_release/apis/3.0/company/countries/1',
        regions: [
            {
                name: 'Alabama',
                code: 'AL',
            },
            {
                name: 'Alaska',
                code: 'AK',
            },
            {
                name: 'American Samoa',
                code: 'AS',
            },
            {
                name: 'Arizona',
                code: 'AZ',
            },
            {
                name: 'Arkansas',
                code: 'AR',
            },
            {
                name: 'California',
                code: 'CA',
            },
            {
                name: 'Colorado',
                code: 'CO',
            },
            {
                name: 'Connecticut',
                code: 'CT',
            },
            {
                name: 'Delaware',
                code: 'DE',
            },
            {
                name: 'District of Columbia',
                code: 'DC',
            },
            {
                name: 'Micronesia',
                code: 'FM',
            },
            {
                name: 'Florida',
                code: 'FL',
            },
            {
                name: 'Georgia',
                code: 'GA',
            },
            {
                name: 'Guam',
                code: 'GU',
            },
            {
                name: 'Hawaii',
                code: 'HI',
            },
            {
                name: 'Idaho',
                code: 'ID',
            },
            {
                name: 'Illinois',
                code: 'IL',
            },
            {
                name: 'Indiana',
                code: 'IN',
            },
            {
                name: 'Iowa',
                code: 'IA',
            },
            {
                name: 'Kansas',
                code: 'KS',
            },
            {
                name: 'Kentucky',
                code: 'KY',
            },
            {
                name: 'Louisiana',
                code: 'LA',
            },
            {
                name: 'Maine',
                code: 'ME',
            },
            {
                name: 'Marshall Islands',
                code: 'MH',
            },
            {
                name: 'Maryland',
                code: 'MD',
            },
            {
                name: 'Massachusetts',
                code: 'MA',
            },
            {
                name: 'Michigan',
                code: 'MI',
            },
            {
                name: 'Minnesota',
                code: 'MN',
            },
            {
                name: 'Mississippi',
                code: 'MS',
            },
            {
                name: 'Missouri',
                code: 'MO',
            },
            {
                name: 'Montana',
                code: 'MT',
            },
            {
                name: 'Nebraska',
                code: 'NE',
            },
            {
                name: 'Nevada',
                code: 'NV',
            },
            {
                name: 'New Hampshire',
                code: 'NH',
            },
            {
                name: 'New Jersey',
                code: 'NJ',
            },
            {
                name: 'New Mexico',
                code: 'NM',
            },
            {
                name: 'New York',
                code: 'NY',
            },
            {
                name: 'North Carolina',
                code: 'NC',
            },
            {
                name: 'North Dakota',
                code: 'ND',
            },
            {
                name: 'Northern Mariana Islands',
                code: 'MP',
            },
            {
                name: 'Ohio',
                code: 'OH',
            },
            {
                name: 'Oklahoma',
                code: 'OK',
            },
            {
                name: 'Oregon',
                code: 'OR',
            },
            {
                name: 'Palau',
                code: 'PW',
            },
            {
                name: 'Pennsylvania',
                code: 'PA',
            },
            {
                name: 'Puerto Rico',
                code: 'PR',
            },
            {
                name: 'Rhode Island',
                code: 'RI',
            },
            {
                name: 'South Carolina',
                code: 'SC',
            },
            {
                name: 'South Dakota',
                code: 'SD',
            },
            {
                name: 'Tennessee',
                code: 'TN',
            },
            {
                name: 'Texas',
                code: 'TX',
            },
            {
                name: 'Utah',
                code: 'UT',
            },
            {
                name: 'Vermont',
                code: 'VT',
            },
            {
                name: 'Virgin Islands',
                code: 'VI',
            },
            {
                name: 'Virginia',
                code: 'VA',
            },
            {
                name: 'Washington',
                code: 'WA',
            },
            {
                name: 'West Virginia',
                code: 'WV',
            },
            {
                name: 'Wisconsin',
                code: 'WI',
            },
            {
                name: 'Wyoming',
                code: 'WY',
            },
            {
                name: 'Armed Forces Americas',
                code: 'AA',
            },
            {
                name: 'Armed Forces Europe, Canada, Africa and Middle East',
                code: 'AE',
            },
            {
                name: 'Armed Forces Pacific',
                code: 'AP',
            },
        ],
    },
    {
        "id": 3,
        countryName: 'Canada',
        countryCode: 'CAN',
        countryRef:
            'https://api-na.myconnectwise.net/v4_6_release/apis/3.0/company/countries/3',
        regions: [
            {
                name: 'Alberta',
                code: 'AB',
            },
            {
                name: 'British Columbia',
                code: 'BC',
            },
            {
                name: 'Manitoba',
                code: 'MB',
            },
            {
                name: 'New Brunswick',
                code: 'NB',
            },
            {
                name: 'Newfoundland and Labrador',
                code: 'NL',
            },
            {
                name: 'Northwest Territories',
                code: 'NT',
            },
            {
                name: 'Nova Scotia',
                code: 'NS',
            },
            {
                name: 'Nunavut',
                code: 'NU',
            },
            {
                name: 'Ontario',
                code: 'ON',
            },
            {
                name: 'Prince Edward Island',
                code: 'PE',
            },
            {
                name: 'Quebec',
                code: 'QC',
            },
            {
                name: 'Saskatchewan',
                code: 'SK',
            },
            {
                name: 'Yukon',
                code: 'YT',
            },
        ],
    },
    {
        "id": 1,
        countryName: 'Australia',
        countryCode: 'AU',
        countryRef:
            'https://api-au.myconnectwise.net/v4_6_release/apis/3.0/company/countries/1',
        regions: [
            {
                name: 'Australian Capital Territory',
                code: 'ACT',
            },
            {
                name: 'New South Wales',
                code: 'NSW',
            },
            {
                name: 'Northern Territory',
                code: 'NT',
            },
            {
                name: 'Queensland',
                code: 'QLD',
            },
            {
                name: 'South Australia',
                code: 'SA',
            },
            {
                name: 'Tasmania',
                code: 'TAS',
            },
            {
                name: 'Victoria',
                code: 'VIC',
            },
            {
                name: 'Western Australia',
                code: 'WA',
            },
        ],
    },
];

module.exports = async function (input) {
    return new Promise(function (resolve, reject) {
        countries.map(country => {
            // Short Circuit if the input is a country name or code
            if (input == country.countryName || input == country.countryCode) resolve({
                countryName: country.countryName,
                countryCode: country.countryCode,
                countryRef: country.countryRef,
                countryId: country.id
            });
            // If a region is the input, trace the country back from it.
            country.regions.map(region => {
                if (region.name == input || region.code == input)
                    resolve({
                        countryName: country.countryName,
                        countryCode: country.countryCode,
                        countryRef: country.countryRef,
                        countryId: country.id,
                        region: region,
                    });
            });
        });
        // Either construct a defacto location in an error handler or ignore completely
        // Create log entry describing why this happened in the calling method.
        resolve(null);
    });
};
