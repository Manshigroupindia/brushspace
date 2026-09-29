const fs = require('fs');

const content = fs.readFileSync('Brushspace Ui/brushspace_shop_artistic_d_cor_catalog/code.html', 'utf8');

// Parse each product item block
const blocks = content.split('<div class="product-item');
const products = [];

for (let i = 1; i < blocks.length; i++) {
  const block = blocks[i].split('</div>\n</div>\n</div>')[0] || blocks[i];
  
  const catMatch = block.match(/data-cat="([^"]+)"/);
  const materialMatch = block.match(/data-material="([^"]+)"/);
  const nameMatch = block.match(/data-name="([^"]+)"/);
  const priceMatch = block.match(/data-price="([^"]+)"/);
  const skuMatch = block.match(/data-sku="([^"]+)"/);
  const stockMatch = block.match(/data-stock="([^"]+)"/);
  const imgMatch = block.match(/<img[^>]+src="([^">]+)"[^>]*>/);
  const dataAltMatch = block.match(/data-alt="([^"]+)"/);
  
  if (nameMatch && skuMatch) {
    products.push({
      sku: skuMatch[1],
      name: nameMatch[1],
      price: parseInt(priceMatch[1], 10),
      category: catMatch ? catMatch[1] : 'Vases',
      material: materialMatch ? materialMatch[1] : '',
      stock: stockMatch ? stockMatch[1] : 'In Studio Stock',
      image: imgMatch ? imgMatch[1] : '',
      alt: dataAltMatch ? dataAltMatch[1] : ''
    });
  }
}

fs.writeFileSync('extracted_products.json', JSON.stringify(products, null, 2));
console.log('Saved', products.length, 'products to extracted_products.json');
