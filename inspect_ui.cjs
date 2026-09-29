const fs = require('fs');
const path = require('path');

const files = [
  'Brushspace Ui/brushspace_artistic_home_d_cor_homepage/code.html',
  'Brushspace Ui/brushspace_shop_artistic_d_cor_catalog/code.html',
  'Brushspace Ui/brushspace_product_details_owl_black_golden_leaves/code.html',
  'Brushspace Ui/brushspace_curated_cart_direct_order/code.html'
];

for (const file of files) {
  if (fs.existsSync(file)) {
    const content = fs.readFileSync(file, 'utf8');
    console.log(`=== ${file} === (${content.length} bytes)`);
    
    // Find all img tags
    const imgMatches = [...content.matchAll(/<img[^>]+src="([^">]+)"[^>]*>/gi)];
    console.log(`Images found: ${imgMatches.length}`);
    
    // Find product items
    const prodMatches = [...content.matchAll(/class="[^"]*product-item[^"]*"([^>]+)>/gi)];
    console.log(`Product elements found: ${prodMatches.length}`);
    for (const pm of prodMatches) {
      console.log('   Attrs:', pm[1].trim());
    }
  }
}
