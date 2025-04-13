
import React, { useState, useEffect } from "react";
import {
  BlockStack,
  Card,
  Select,
  Text,
  Button,
  Banner,
  InlineStack,
  Spinner
} from "@shopify/polaris";

export function SuggestionReviewEmbed({ shopDomain }) {
  const [selectedPath, setSelectedPath] = useState("/");
  const [isLoading, setIsLoading] = useState(true);
  const [pageOptions, setPageOptions] = useState([
    { label: "Home Page", value: "/" }
  ]);
  const [suggestions, setSuggestions] = useState([]);
  const [isRunningAudit, setIsRunningAudit] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    async function fetchPageOptions() {
      if (!shopDomain) return;
      
      try {
        setIsLoading(true);
        const response = await fetch(`/api/choices`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch options: ${response.status}`);
        }
        
        const data = await response.json();
        
        if (data.options && data.options.length > 0) {
          setPageOptions(data.options);
          setSelectedPath(data.options[0].value);
        }
      } catch (error) {
        console.error("Error fetching page options:", error);
        setError("Failed to load page options. Using defaults.");
      } finally {
        setIsLoading(false);
      }
    }

    fetchPageOptions();
  }, [shopDomain]);

  const handleSubmit = async () => {
    if (!shopDomain) {
      setError("Missing Shopify domain — please refresh the app.");
      return;
    }
    
    if (!selectedPath) {
      setError("Please select a page to audit.");
      return;
    }
    
    // Construct the full URL using the shop domain and selected path
    const crawlUrl = `https://${shopDomain}${selectedPath}`;
    console.log("Form submitted with URL:", crawlUrl);
    
    setIsRunningAudit(true);
    setError(null);
    
    try {
      // Call the backend directly using the Render endpoint
      const response = await fetch('https://auditai-insight-engine.onrender.com/api/crawl', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shop-Domain': shopDomain, // Include shop domain in header
        },
        body: JSON.stringify({ url: crawlUrl, shop: shopDomain }),
      });
      
      if (!response.ok) {
        throw new Error(`Error running audit: ${response.status}`);
      }
      
      const data = await response.json();
      setSuggestions(data.suggestions || []);
    } catch (error) {
      console.error("Error running audit:", error);
      setError("Failed to run the audit. Please try again later or check your network connection.");
    } finally {
      setIsRunningAudit(false);
    }
  };

  const handleSelectChange = (value) => {
    setSelectedPath(value);
  };

  return (
    <BlockStack gap="500">
      {error && (
        <Banner status="critical" onDismiss={() => setError(null)}>
          <p>{error}</p>
        </Banner>
      )}
      
      <Card>
        <BlockStack gap="400">
          <Text as="h2" variant="headingMd">Page Selection</Text>
          
          <Select
            label="Page to audit"
            options={pageOptions}
            onChange={handleSelectChange}
            value={selectedPath}
            disabled={isLoading || isRunningAudit}
          />
          
          <Button 
            primary 
            onClick={handleSubmit} 
            loading={isRunningAudit}
            disabled={isLoading || !selectedPath}
          >
            Run Audit
          </Button>
        </BlockStack>
      </Card>
      
      {isRunningAudit && (
        <Card>
          <BlockStack gap="400" align="center" inlineAlign="center" padding="500">
            <Spinner size="large" />
            <Text as="p" variant="bodyMd">
              Running audit...
            </Text>
          </BlockStack>
        </Card>
      )}
      
      {suggestions.length > 0 && (
        <Card>
          <BlockStack gap="400">
            <Text as="h2" variant="headingMd">Audit Results</Text>
            
            {suggestions.map((suggestion, index) => (
              <Card key={index}>
                <BlockStack gap="300">
                  <Text as="h3" variant="headingMd" fontWeight="semibold">
                    {suggestion.title}
                  </Text>
                  <Text as="p" variant="bodyMd">
                    {suggestion.description}
                  </Text>
                  <InlineStack gap="300" align="start">
                    <Text as="span" variant="bodyMd" color="subdued">
                      Impact: {suggestion.impact || 'medium'}
                    </Text>
                  </InlineStack>
                </BlockStack>
              </Card>
            ))}
          </BlockStack>
        </Card>
      )}
    </BlockStack>
  );
};

export default SuggestionReviewEmbed;
