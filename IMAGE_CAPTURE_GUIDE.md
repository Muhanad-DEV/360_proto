# 360° Image Capture Documentation Guide

## Table Structure for Image Capture

When shooting 360-degree panoramic images for the virtual tour, follow this exact table structure:

| Field Name | Data Type | Example | Description | Required |
|------------|-----------|---------|-------------|----------|
| **node_id** | String | "1", "2", "3" | Unique identifier for the panorama node | ✅ |
| **image_filename** | String | "IMG_20250526_162018_00_003.jpg" | Exact filename of the panoramic image | ✅ |
| **location_name** | String | "Main Entrance", "Corridor", "Library Hall" | Descriptive name for the location | ✅ |
| **gps_latitude** | Number | 23.591921 | GPS latitude coordinate (decimal degrees) | ✅ |
| **gps_longitude** | Number | 58.168091 | GPS longitude coordinate (decimal degrees) | ✅ |
| **gps_altitude** | Number | 0 | GPS altitude in meters (can be 0 if unknown) | ✅ |
| **camera_direction** | String | "north", "south", "east", "west" | Cardinal direction camera is facing | ✅ |
| **camera_yaw_degrees** | Number | 0, 90, 180, 270 | Exact yaw in degrees (0=North, 90=East, 180=South, 270=West) | ✅ |
| **connected_nodes** | String | "2,3" | Comma-separated list of node IDs this connects to | ✅ |
| **shooting_time** | String | "2025-05-26 16:20:18" | Timestamp when photo was taken (YYYY-MM-DD HH:MM:SS) | ⚪ |
| **weather_conditions** | String | "sunny", "cloudy", "overcast" | Weather during capture | ⚪ |
| **notes** | String | "Main entrance with reception desk visible" | Additional notes about the location | ⚪ |

## Data Collection Template

Copy this table and fill it out for each panoramic image you capture:


| node_id | image_filename | location_name | gps_latitude | gps_longitude | gps_altitude | camera_direction | camera_yaw_degrees | connected_nodes | shooting_time | weather_conditions | notes |
|---------|----------------|---------------|--------------|---------------|--------------|------------------|-------------------|-----------------|---------------|-------------------|-------|
| 1 | IMG_001.jpg | | | | 0 | north | 0 | | | | |
| 2 | IMG_002.jpg | | | | 0 | north | 0 | | | | |
| 3 | IMG_003.jpg | | | | 0 | north | 0 | | | | |
| 4 | IMG_004.jpg | | | | 0 | north | 0 | | | | |


## Important Shooting Guidelines

### 1. GPS Coordinates
- Use a GPS app on your phone to get precise coordinates
- Record coordinates in decimal degrees format (e.g., 23.591921, not 23°35'30.9")
- Take coordinates at the exact spot where you place the camera/tripod

### 2. Camera Direction
- **CRITICAL**: Note which cardinal direction your camera is facing when taking the shot
- Use a compass app on your phone for accuracy
- Record both the direction name (north/south/east/west) and exact degrees

### 3. Image Naming Convention
- Use descriptive, sequential filenames
- Include date/time if possible: `IMG_YYYYMMDD_HHMMSS_XX_XXX.jpg`
- Ensure filenames are unique and don't contain spaces

### 4. Node Connections
- Plan your route before shooting
- Note which other locations this spot should connect to
- Consider natural walking paths and sightlines

## AI Prompt Template

Use this prompt with any AI to generate the complete JSON structure from your filled table:

---

**AI PROMPT:**

```
Please convert the following table data into a complete JSON structure for a 360° virtual tour using Photo Sphere Viewer. The JSON should include:

1. A locations object with GPS coordinates for each node
2. A nodes array with complete node configuration
3. Proper calculateBearing implementation for arrow directions
4. All required fields for Photo Sphere Viewer Virtual Tour Plugin

Use this exact calculateBearing function:
```javascript
const calculateBearing = (lat1, lon1, lat2, lon2) => {
  const toRadians = (degrees) => degrees * (Math.PI / 180);
  const toDegrees = (radians) => radians * (180 / Math.PI);
  
  const dLon = toRadians(lon2 - lon1);
  const lat1Rad = toRadians(lat1);
  const lat2Rad = toRadians(lat2);
  
  const y = Math.sin(dLon) * Math.cos(lat2Rad);
  const x = Math.cos(lat1Rad) * Math.sin(lat2Rad) - 
            Math.sin(lat1Rad) * Math.cos(lat2Rad) * Math.cos(dLon);
  
  const bearing = Math.atan2(y, x);
  return bearing; // Return in radians for Photo Sphere Viewer
};
```

My table data:
[PASTE YOUR COMPLETED TABLE HERE]

Generate the complete JSON structure that can be directly used in a React component with Photo Sphere Viewer Virtual Tour Plugin. Include proper error handling and comments explaining the calculations.
```

---

## Example Usage

Here's an example of a completed table row:

```
| node_id | image_filename | location_name | gps_latitude | gps_longitude | gps_altitude | camera_direction | camera_yaw_degrees | connected_nodes | shooting_time | weather_conditions | notes |
|---------|----------------|---------------|--------------|---------------|--------------|------------------|-------------------|-----------------|---------------|-------------------|-------|
| 1 | IMG_20250526_162018_00_003.jpg | Main Entrance | 23.591921 | 58.168091 | 0 | north | 0 | 2 | 2025-05-26 16:20:18 | sunny | Starting point with reception desk |
| 2 | IMG_20250526_162353_00_006.jpg | Corridor | 23.592076 | 58.168081 | 0 | north | 0 | 1,3 | 2025-05-26 16:23:53 | sunny | Main hallway connecting areas |
```

## Quality Checklist

Before submitting your data, verify:

- [ ] All required fields are filled
- [ ] GPS coordinates are in decimal degrees
- [ ] Image filenames match actual files
- [ ] Camera directions are consistent
- [ ] Node connections make logical sense
- [ ] No duplicate node IDs
- [ ] All connected nodes exist in the table

## Technical Notes

- The system uses `positionMode: 'gps'` for accurate arrow positioning
- Arrow yaw calculations are done automatically using GPS coordinates
- All images should ideally face the same direction (preferably north) for consistency
- The calculateBearing function returns radians for direct use in Photo Sphere Viewer
- Links between nodes are bidirectional but must be defined for each node separately 
