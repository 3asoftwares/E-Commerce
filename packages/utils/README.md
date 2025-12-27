# Utils Package

Shared utility functions and helpers used across all applications.

## Categories

### Formatting

- Currency formatting
- Date formatting
- Number formatting
- Text truncation
- Phone number formatting

### Validation

- Email validation
- URL validation
- Credit card validation
- Form validators
- Custom validation rules

### String Utilities

- Slugify
- Capitalize
- Truncate
- Remove whitespace
- Generate random strings

### Array Utilities

- Unique values
- Group by
- Sort utilities
- Chunk array
- Flatten array

### Object Utilities

- Deep clone
- Deep merge
- Pick/omit keys
- Is empty check

### Number Utilities

- Percentage calculation
- Random number
- Clamp
- Round to precision

### Date Utilities

- Format dates
- Parse dates
- Date comparisons
- Relative time (e.g., "2 hours ago")

### API Utilities

- Build query string
- Parse query string
- API error handling

### Storage Utilities

- LocalStorage wrapper
- SessionStorage wrapper
- Cookie utilities

### Constants

- Regex patterns
- Error messages
- Configuration constants

## Usage

All apps import utilities from this package:

```
import { formatCurrency, validateEmail } from '@ecommerce/utils';
```
