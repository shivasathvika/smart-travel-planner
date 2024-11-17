import React from 'react';
import {
  Autocomplete,
  Chip,
  TextField,
  Box,
  Typography,
} from '@mui/material';
import { LocalOffer as TagIcon } from '@mui/icons-material';

export interface Tag {
  id: string;
  name: string;
  color?: string;
}

interface TagSelectorProps {
  selectedTags: Tag[];
  onChange: (tags: Tag[]) => void;
  error?: string;
}

// Predefined tags with colors
const predefinedTags: Tag[] = [
  { id: '1', name: 'Business', color: '#1976d2' },
  { id: '2', name: 'Vacation', color: '#2e7d32' },
  { id: '3', name: 'Weekend Trip', color: '#ed6c02' },
  { id: '4', name: 'Family', color: '#9c27b0' },
  { id: '5', name: 'Adventure', color: '#d32f2f' },
  { id: '6', name: 'Road Trip', color: '#0288d1' },
  { id: '7', name: 'Cultural', color: '#7b1fa2' },
  { id: '8', name: 'Food Tour', color: '#c2185b' },
  { id: '9', name: 'Nature', color: '#388e3c' },
  { id: '10', name: 'City Break', color: '#f57c00' },
];

const TagSelector: React.FC<TagSelectorProps> = ({
  selectedTags,
  onChange,
  error,
}) => {
  const handleCreateTag = (tagName: string) => {
    const newTag: Tag = {
      id: `custom-${Date.now()}`,
      name: tagName,
      color: '#666666', // Default color for custom tags
    };
    onChange([...selectedTags, newTag]);
  };

  return (
    <Box>
      <Autocomplete
        multiple
        id="tags-selector"
        options={predefinedTags}
        value={selectedTags}
        getOptionLabel={(option) => option.name}
        isOptionEqualToValue={(option, value) => option.id === value.id}
        onChange={(_, newValue) => onChange(newValue)}
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip
              {...getTagProps({ index })}
              key={option.id}
              label={option.name}
              sx={{
                backgroundColor: option.color,
                color: 'white',
                '& .MuiChip-deleteIcon': {
                  color: 'rgba(255, 255, 255, 0.7)',
                  '&:hover': {
                    color: 'white',
                  },
                },
              }}
            />
          ))
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label={
              <Box display="flex" alignItems="center" gap={1}>
                <TagIcon />
                <span>Tags</span>
              </Box>
            }
            placeholder="Add tags..."
            error={!!error}
            helperText={error}
          />
        )}
        freeSolo
        onInputChange={(event, newValue, reason) => {
          if (reason === 'enter' && newValue && !predefinedTags.find(tag => tag.name === newValue)) {
            handleCreateTag(newValue);
          }
        }}
      />
      <Typography
        variant="caption"
        color="textSecondary"
        sx={{ mt: 1, display: 'block' }}
      >
        Choose from predefined tags or create your own by typing and pressing Enter
      </Typography>
    </Box>
  );
};

export default TagSelector;
