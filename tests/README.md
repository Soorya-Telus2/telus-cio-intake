# Test Files

This directory contains test files for the TELUS CIO Project Intake Form application.

## Directory Structure

- `api/` - API integration tests
- `services/` - Service layer tests  
- `integration/` - End-to-end integration tests

## Test Files

### Services Tests
- `test-basic-pdf.js` - Tests for basic PDF generation functionality

## Running Tests

To run individual test files:
```bash
node tests/services/test-basic-pdf.js
```

## Notes

- These are development/debugging test files created during the application development process
- Test files may require environment variables to be configured (see `.env.example`)
- Some tests may require Firebase and FuelIX API credentials to run successfully

## Adding New Tests

When adding new test files:
1. Place them in the appropriate subdirectory based on what they test
2. Follow the naming convention: `test-[feature-name].js`
3. Update this README with a description of the new test file
