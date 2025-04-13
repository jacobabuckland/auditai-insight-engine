
import { json } from "@remix-run/node";
import { authenticate } from "../shopify.server";

export const loader = async ({ request }) => {
  const { admin, session } = await authenticate.admin(request);
  
  try {
    // Fetch first 10 products
    const productsResponse = await admin.graphql(
      `#graphql
      query GetProducts {
        products(first: 10) {
          edges {
            node {
              title
              handle
            }
          }
        }
      }`
    );
    const productsData = await productsResponse.json();
    
    // Fetch first 10 collections
    const collectionsResponse = await admin.graphql(
      `#graphql
      query GetCollections {
        collections(first: 10) {
          edges {
            node {
              title
              handle
            }
          }
        }
      }`
    );
    const collectionsData = await collectionsResponse.json();
    
    // Format the data for the dropdown
    const productOptions = productsData.data.products.edges.map(({ node }) => ({
      label: `Product: ${node.title}`,
      value: `/products/${node.handle}`
    }));
    
    const collectionOptions = collectionsData.data.collections.edges.map(({ node }) => ({
      label: `Collection: ${node.title}`,
      value: `/collections/${node.handle}`
    }));
    
    // Add the default home page option
    const homeOption = [{ label: "Home Page", value: "/" }];
    
    // Combine all options
    const options = [...homeOption, ...productOptions, ...collectionOptions];
    
    return json({ options });
  } catch (error) {
    console.error("Error fetching options from Shopify:", error);
    return json({ 
      options: [{ label: "Home Page", value: "/" }],
      error: "Failed to fetch options from Shopify"
    });
  }
};
