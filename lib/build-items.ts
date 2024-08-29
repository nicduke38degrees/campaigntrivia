import axios from 'axios';

interface ApiResponse {
    result: {
        items: {
            guid: string;
            slug: string;
            name: string;
            went_live_at: number;
            og_image: string;
            og_description: string;
            initial_action_type: string;
        }[]
    }
}

interface TransformedObject {
    date_prop_id: string;
    id: string;
    label: string;
    image: string;
    description: string;
    went_live_at: number;
    journey_url: string;
}

const fetchAndTransformData = async (page: number, rowsPerPage: number): Promise<TransformedObject[]> => {
    try {
        const response = await axios.post<ApiResponse>(
            'https://act.38degrees.org.uk/api/journeys',
            { args: { page, rowsPerPage } },
            {
                headers: {
                    'x-csrf': 'dirk'
                }
            }
        );
        // Filter and transform the response data
        return response.data.result.items
            .filter(item => item.initial_action_type === 'petition:PetitionAction')
            .map(item => ({
                date_prop_id: 'P38',
                id: item.guid,
                label: item.name,
                image: item.og_image,
                description: item.og_description,
                went_live_at: item.went_live_at,
                journey_url: item.slug
            }));
    } catch (error) {
        console.error('Error making the request:', error);
        return [];
    }
};

export const accumulateTransformedData = async (): Promise<TransformedObject[]> => {
    const transformedData: TransformedObject[] = [];
    let page = 0;
    const rowsPerPage = 100;

    while (transformedData.length < 100) {
        const newTransformedData = await fetchAndTransformData(page, rowsPerPage);
        
        // Break if no more data is returned
        if (newTransformedData.length === 0) {
            break;
        }

        transformedData.push(...newTransformedData);
        page++;
    }

    return transformedData.slice(0, 100); // Return exactly 100 items if more were accumulated
};


