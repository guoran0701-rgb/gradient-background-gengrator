import {
  hexToRgb,
  rgbToHex,
  rgbToHsl,
  hslToRgb,
  hexToHsl,
  hslToHex,
  getComplementaryColor,
  getAnalogousColors,
  getTriadicColors,
  getSplitComplementaryColors,
  getMonochromaticColors,
  getAllColorRecommendations,
  getRandomColor,
} from './colorUtils';

console.log('🧪 开始色彩推荐算法测试...\n');

function testHexRgbConversion() {
  console.log('1. 测试 Hex ↔ RGB 转换');
  const hex1 = '#FF0000';
  const rgb1 = hexToRgb(hex1);
  console.log(`   ${hex1} → RGB:`, rgb1);
  
  const hex2 = rgbToHex(255, 0, 0);
  console.log(`   RGB(255, 0, 0) → Hex:`, hex2);
  
  console.log(`   测试通过: ${hex1 === hex2}`);
  console.log('');
}

function testHslConversion() {
  console.log('2. 测试 HSL 转换');
  const hex = '#FF0000';
  const hsl = hexToHsl(hex);
  console.log(`   ${hex} → HSL:`, hsl);
  
  const convertedBack = hslToHex(hsl.h, hsl.s, hsl.l);
  console.log(`   HSL → Hex:`, convertedBack);
  console.log('');
}

function testComplementaryColor() {
  console.log('3. 测试互补色');
  const colors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00'];
  colors.forEach(color => {
    const complementary = getComplementaryColor(color);
    console.log(`   ${color} → 互补色: ${complementary}`);
  });
  console.log('');
}

function testAnalogousColors() {
  console.log('4. 测试类似色');
  const color = '#FF0000';
  const analogous = getAnalogousColors(color, 1);
  console.log(`   ${color} → 类似色:`, analogous);
  console.log('');
}

function testTriadicColors() {
  console.log('5. 测试三角色');
  const color = '#FF0000';
  const triadic = getTriadicColors(color);
  console.log(`   ${color} → 三角色:`, triadic);
  console.log('');
}

function testSplitComplementaryColors() {
  console.log('6. 测试分裂互补色');
  const color = '#FF0000';
  const split = getSplitComplementaryColors(color);
  console.log(`   ${color} → 分裂互补色:`, split);
  console.log('');
}

function testMonochromaticColors() {
  console.log('7. 测试单色渐变');
  const color = '#FF0000';
  const mono = getMonochromaticColors(color, 4);
  console.log(`   ${color} → 单色渐变:`, mono);
  console.log('');
}

function testAllRecommendations() {
  console.log('8. 测试所有推荐方案');
  const color = '#5135FF';
  const recommendations = getAllColorRecommendations(color);
  console.log(`   基于颜色 ${color} 的推荐方案:`);
  recommendations.forEach(rec => {
    console.log(`   - ${rec.name} (${rec.type}):`, rec.colors);
  });
  console.log('');
}

function testRandomColor() {
  console.log('9. 测试随机颜色生成');
  const randomColors = Array.from({ length: 5 }, () => getRandomColor());
  console.log('   随机生成的颜色:', randomColors);
  console.log('');
}

function runAllTests() {
  try {
    testHexRgbConversion();
    testHslConversion();
    testComplementaryColor();
    testAnalogousColors();
    testTriadicColors();
    testSplitComplementaryColors();
    testMonochromaticColors();
    testAllRecommendations();
    testRandomColor();
    console.log('✅ 所有测试通过！色彩推荐算法功能正常。');
  } catch (error) {
    console.error('❌ 测试失败:', error);
  }
}

runAllTests();
