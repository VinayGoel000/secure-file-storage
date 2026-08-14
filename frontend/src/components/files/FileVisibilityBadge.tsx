import Badge from '@/components/ui/Badge';

interface FileVisibilityBadgeProps {
  isPublic: boolean;
}

export default function FileVisibilityBadge({ isPublic }: FileVisibilityBadgeProps) {
  return (
    <Badge variant={isPublic ? 'success' : 'default'}>
      {isPublic ? 'Public' : 'Private'}
    </Badge>
  );
}
