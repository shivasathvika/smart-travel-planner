import React from 'react';
import { Box, Chip } from '@mui/material';
import { Tag } from './TagSelector';

interface TagListProps {
  tags: Tag[];
  size?: 'small' | 'medium';
  onClick?: (tag: Tag) => void;
}

const TagList: React.FC<TagListProps> = ({
  tags,
  size = 'small',
  onClick,
}) => {
  return (
    <Box
      display="flex"
      gap={0.5}
      flexWrap="wrap"
      sx={{
        minHeight: size === 'small' ? 24 : 32,
      }}
    >
      {tags.map((tag) => (
        <Chip
          key={tag.id}
          label={tag.name}
          size={size}
          sx={{
            backgroundColor: tag.color,
            color: 'white',
            cursor: onClick ? 'pointer' : 'default',
            '&:hover': onClick ? {
              opacity: 0.9,
              transform: 'scale(1.02)',
            } : undefined,
          }}
          onClick={onClick ? () => onClick(tag) : undefined}
        />
      ))}
    </Box>
  );
};

export default TagList;
