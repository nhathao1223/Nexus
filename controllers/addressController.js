const logger = require('../config/logger');

// API Vietnam địa chỉ
const API_URL = 'https://provinces.open-api.vn/api';

const fetchOpts = {
  headers: {
    Accept: 'application/json',
    'User-Agent': 'Nexus-Ecommerce/1.0 (Render)'
  }
};

async function fetchWithTimeout(url, ms = 20000) {
  const controller = new AbortController();
  const t = setTimeout(() => controller.abort(), ms);
  try {
    const response = await fetch(url, { ...fetchOpts, signal: controller.signal });
    return response;
  } finally {
    clearTimeout(t);
  }
}

/**
 * Get all provinces
 */
exports.getProvinces = async (req, res) => {
  try {
    const response = await fetchWithTimeout(`${API_URL}/?depth=1`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const provinces = await response.json();
    
    res.json({
      success: true,
      data: provinces
    });
  } catch (error) {
    logger.error(`Error fetching provinces: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch provinces'
    });
  }
};

/**
 * Get districts by province code
 */
exports.getDistricts = async (req, res) => {
  try {
    const { provinceCode } = req.params;
    
    if (!provinceCode) {
      return res.status(400).json({
        success: false,
        message: 'Province code is required'
      });
    }

    const response = await fetchWithTimeout(`${API_URL}/p/${provinceCode}?depth=2`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const province = await response.json();
    
    if (!province || !province.districts) {
      return res.status(404).json({
        success: false,
        message: 'Province not found'
      });
    }

    res.json({
      success: true,
      data: province.districts
    });
  } catch (error) {
    logger.error(`Error fetching districts: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch districts'
    });
  }
};

/**
 * Get wards by district code
 */
exports.getWards = async (req, res) => {
  try {
    const { districtCode } = req.params;
    
    if (!districtCode) {
      return res.status(400).json({
        success: false,
        message: 'District code is required'
      });
    }

    const response = await fetchWithTimeout(`${API_URL}/d/${districtCode}?depth=2`);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    const district = await response.json();
    
    if (!district || !district.wards) {
      return res.status(404).json({
        success: false,
        message: 'District not found'
      });
    }

    res.json({
      success: true,
      data: district.wards
    });
  } catch (error) {
    logger.error(`Error fetching wards: ${error.message}`);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch wards'
    });
  }
};
