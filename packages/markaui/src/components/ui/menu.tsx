// Friendly aliases over the dropdown-menu primitives so consumers can write
// `import { Menu, MenuItem, MenuShortcut } from "./menu"`.
// Every export is a thin 1:1 rename of a DropdownMenu* component.
export {
  DropdownMenu as Menu,
  DropdownMenuTrigger as MenuTrigger,
  DropdownMenuContent as MenuContent,
  DropdownMenuGroup as MenuGroup,
  DropdownMenuLabel as MenuLabel,
  DropdownMenuItem as MenuItem,
  DropdownMenuCheckboxItem as MenuCheckboxItem,
  DropdownMenuRadioGroup as MenuRadioGroup,
  DropdownMenuRadioItem as MenuRadioItem,
  DropdownMenuSeparator as MenuSeparator,
  DropdownMenuShortcut as MenuShortcut,
} from "./dropdown-menu"
