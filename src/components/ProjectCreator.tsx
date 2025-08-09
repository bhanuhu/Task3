import * as React from "react";
import { format } from "date-fns";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { 
  Calendar as CalendarIcon, 
  Check, 
  ChevronDown, 
  Flag, 
  ListTodo, 
  Plus, 
  Tag,
  Trash2, 
  Users, 
  X, 
  Circle, 
  AlertTriangle, 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  Minus,
  OctagonAlert,
  BatteryLow,
  BatteryMedium,
  BatteryFull,
  Hexagon,
  CircleX,
  CircleCheck,
  CircleDashed,
  CircleEllipsis,
} from 'lucide-react';
import { cn } from "@/lib/utils";

// Define types for status and priority
type Status = "Backlog" | "Planned" | "In Progress" | "Completed" | "Canceled";
type Priority = "No Priority" | "Low" | "Medium" | "High";

// Status and priority options with their respective icons
const STATUS_OPTIONS = [
  { label: "Backlog" as const, icon: CircleDashed },
  { label: "Planned" as const, icon: Circle },
  { label: "In Progress" as const, icon: CircleEllipsis },
  { label: "Completed" as const, icon: CircleCheck },
  { label: "Canceled" as const, icon: CircleX },
] as const;

const PRIORITY_OPTIONS = [
  { label: "No Priority" as const, icon: Minus },
  { label: "Urgent" as const, icon: OctagonAlert },
  { label: "Low" as const, icon: BatteryLow },
  { label: "Medium" as const, icon: BatteryMedium },
  { label: "High" as const, icon: BatteryFull },
] as const;

// Reusable chip component for status, priority, etc.
function ChipTrigger({
  children,
  icon: Icon,
}: {
  children: React.ReactNode;
  icon?: React.ComponentType<React.SVGProps<SVGSVGElement>>;
}) {
  return (
    <Button
      variant="secondary"
      size="sm"
      className="rounded-full h-8 px-3 gap-2 border"
    >
      {Icon ? <Icon className="h-4 w-4" aria-hidden /> : null}
      <span className="text-sm leading-none">{children}</span>
      <ChevronDown className="h-3.5 w-3.5 opacity-70" aria-hidden />
    </Button>
  );
}

export default function ProjectCreator() {
  const [open, setOpen] = React.useState(false);
  const [status, setStatus] = React.useState<Status>(STATUS_OPTIONS[0].label);
  const [priority, setPriority] = React.useState<Priority>(PRIORITY_OPTIONS[0].label);
  
  // Get status and priority icon components
  const StatusIcon = () => {
    const option = STATUS_OPTIONS.find(opt => opt.label === status);
    const Icon = option?.icon || CircleDashed;
    return <Icon className="w-4 h-4" />;
  };
  
  const PriorityIcon = () => {
    const option = PRIORITY_OPTIONS.find(opt => opt.label === priority);
    const Icon = option?.icon || Minus;
    return <Icon className="w-4 h-4" />;
  };

  const [startDate, setStartDate] = React.useState<Date | undefined>();
  const [targetDate, setTargetDate] = React.useState<Date | undefined>();
  const [title, setTitle] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [isFavorite, setIsFavorite] = React.useState(false);
  
  // Label state
  const [availableLabels, setAvailableLabels] = React.useState([
    { id: 1, name: 'Design', color: 'bg-blue-500' },
    { id: 2, name: 'Frontend', color: 'bg-green-500' },
    { id: 3, name: 'Backend', color: 'bg-purple-500' },
    { id: 4, name: 'Bug', color: 'bg-red-500' },
    { id: 5, name: 'Enhancement', color: 'bg-yellow-500' },
  ]);
  const [selectedLabels, setSelectedLabels] = React.useState<number[]>([]);
  const [newLabelName, setNewLabelName] = React.useState('');
  const [newLabelColor, setNewLabelColor] = React.useState('bg-gray-500');
  
  // Form submission handler
  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();
    
    if (!title.trim()) {
      alert('Please enter a project name');
      return false;
    }
    
    const projectData = {
      title: title.trim(),
      description: description.trim(),
      status,
      priority,
      startDate: startDate?.toISOString(),
      targetDate: targetDate?.toISOString(),
      isFavorite,
      labels: availableLabels.filter(label => selectedLabels.includes(label.id)),
      milestones: milestones.map(milestone => ({
        ...milestone,
        date: milestone.date?.toISOString()
      })),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    console.log('Creating project:', projectData);
    
    // Here you would typically make an API call to create the project
    // For now, we'll just close the dialog and log the data
    setOpen(false);
    
    // Reset form
    setTitle('');
    setDescription('');
    setStatus(STATUS_OPTIONS[0].label);
    setPriority(PRIORITY_OPTIONS[0].label);
    setStartDate(undefined);
    setTargetDate(undefined);
    setMilestones([{ id: 1, title: '', date: undefined, description: '', isExpanded: false }]);
    setSelectedLabels([]);
    
    return true;
  };
  
  // Milestone state
  const [milestones, setMilestones] = React.useState([
    {
      id: 1,
      title: "",
      date: undefined as Date | undefined,
      description: "",
      isExpanded: false
    }
  ]);
  
  // Toggle milestone expansion
  const toggleMilestone = (id: number) => {
    setMilestones(milestones.map(milestone => 
      milestone.id === id 
        ? { ...milestone, isExpanded: !milestone.isExpanded }
        : milestone
    ));
  };
  
  // Add a new milestone
  const addNewMilestone = () => {
    const newId = milestones.length > 0 ? Math.max(...milestones.map(m => m.id)) + 1 : 1;
    setMilestones([...milestones, {
      id: newId,
      title: "",
      date: undefined,
      description: "",
      isExpanded: true
    }]);
  };
  
  // Update a milestone field
  const updateMilestoneField = (id: number, field: string, value: any) => {
    setMilestones(milestones.map(milestone => 
      milestone.id === id 
        ? { ...milestone, [field]: value }
        : milestone
    ));
  };
  
  // Remove a milestone
  const removeMilestone = (id: number) => {
    if (milestones.length > 1) {
      setMilestones(milestones.filter(m => m.id !== id));
    }
  };
  
  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white">
          New project
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl p-0 rounded-lg overflow-hidden flex flex-col h-[90vh]">
        <form onSubmit={(e) => e.preventDefault()} className="flex flex-col h-full">
          {/* Sticky Header */}
          <div className="flex items-center justify-between p-4 border-b sticky top-0 bg-white z-10">
            <h2 className="text-lg font-semibold">New project</h2>
            <DialogClose asChild>
              <Button 
                variant="ghost" 
                size="icon" 
                className="h-8 w-8"
                onClick={(e) => e.stopPropagation()}
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M18 6 6 18"/>
                  <path d="m6 6 12 12"/>
                </svg>
                <span className="sr-only">Close</span>
              </Button>
            </DialogClose>
          </div>
          
          {/* Scrollable Content */}
          <div className="flex-1 overflow-y-auto p-6">
        
        <div className="overflow-y-auto px-6 py-4 flex-1">
          {/* Toolbar chips */}
          <div className="flex flex-wrap gap-2">
            {/* Status */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <span>
                  <ChipTrigger>
                    <span className="flex items-center gap-2">
                      <StatusIcon />
                      {status}
                    </span>
                  </ChipTrigger>
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-52">
                <DropdownMenuLabel>Change status…</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {STATUS_OPTIONS.map((opt) => (
                  <DropdownMenuItem 
                  key={opt.label} 
                  onClick={() => setStatus(opt.label)}
                  className={status === opt.label ? 'bg-accent' : ''}
                >
                  <div className="flex items-center gap-2 w-full">
                    {React.createElement(opt.icon, { className: 'w-4 h-4 text-muted-foreground' })}
                    <span>{opt.label}</span>
                  </div>
                </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Priority */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <span>
                  <ChipTrigger>
                    <span className="flex items-center gap-2">
                      <PriorityIcon />
                      {priority}
                    </span>
                  </ChipTrigger>
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start" className="w-52">
                <DropdownMenuLabel>Change priority…</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {PRIORITY_OPTIONS.map((opt) => {
                  const isSelected = priority === opt.label;
                  return (
                    <DropdownMenuItem 
                      key={opt.label} 
                      onClick={() => setPriority(opt.label as Priority)}
                      className={isSelected ? 'bg-accent' : ''}
                    >
                      <div className="flex items-center gap-2 w-full">
                        {React.createElement(opt.icon, { className: 'w-4 h-4 text-muted-foreground' })}
                        <span>{opt.label}</span>
                      </div>
                    </DropdownMenuItem>
                  );
                })}
              </DropdownMenuContent>
            </DropdownMenu>

            {/* Members */}
            <Popover>
              <PopoverTrigger asChild>
                <span>
                  <ChipTrigger icon={Users}>Members</ChipTrigger>
                </span>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-64">
                <p className="text-sm text-muted-foreground">Team picker placeholder</p>
              </PopoverContent>
            </Popover>

            {/* Start date */}
            <Popover>
              <PopoverTrigger asChild>
                <span>
                  <ChipTrigger icon={CalendarIcon}>
                    {startDate ? `Start ${format(startDate, "MMM d, yyyy")}` : "Start"}
                  </ChipTrigger>
                </span>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={startDate}
                  onSelect={setStartDate}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>

            {/* Target date */}
            <Popover>
              <PopoverTrigger asChild>
                <span>
                  <ChipTrigger icon={CalendarIcon}>
                    {targetDate ? `Target ${format(targetDate, "MMM d, yyyy")}` : "Target"}
                  </ChipTrigger>
                </span>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={targetDate}
                  onSelect={setTargetDate}
                  initialFocus
                  className={cn("p-3 pointer-events-auto")}
                />
              </PopoverContent>
            </Popover>

            {/* Labels */}
            <Popover>
              <PopoverTrigger asChild>
                <span>
                  <ChipTrigger icon={Tag}>
                    {selectedLabels.length > 0 ? `${selectedLabels.length} labels` : 'Labels'}
                  </ChipTrigger>
                </span>
              </PopoverTrigger>
              <PopoverContent align="start" className="w-72 p-4 space-y-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium">Add or select labels</div>
                  <div className="flex gap-2">
                    <Input 
                      placeholder="New label name" 
                      value={newLabelName}
                      onChange={(e) => setNewLabelName(e.target.value)}
                      className="h-8 text-sm"
                    />
                    <select
                      value={newLabelColor}
                      onChange={(e) => setNewLabelColor(e.target.value)}
                      className="h-8 text-sm rounded-md border border-input bg-background px-3 py-1 text-sm"
                    >
                      <option value="">Select color</option>
                      <option value="bg-red-500">Red</option>
                      <option value="bg-blue-500">Blue</option>
                      <option value="bg-green-500">Green</option>
                      <option value="bg-yellow-500">Yellow</option>
                      <option value="bg-purple-500">Purple</option>
                      <option value="bg-pink-500">Pink</option>
                      <option value="bg-gray-500">Gray</option>
                    </select>
                    <Button 
                      size="sm" 
                      onClick={() => {
                        if (newLabelName.trim()) {
                          const newLabel = {
                            id: Date.now(),
                            name: newLabelName.trim(),
                            color: newLabelColor
                          };
                          setAvailableLabels([...availableLabels, newLabel]);
                          setNewLabelName('');
                        }
                      }}
                      disabled={!newLabelName.trim()}
                    >
                      Add
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-2">
                  <div className="text-sm font-medium">Available labels</div>
                  <div className="flex flex-wrap gap-2 max-h-40 overflow-y-auto p-1">
                    {availableLabels.map((label) => {
                      const isSelected = selectedLabels.includes(label.id);
                      return (
                        <Badge 
                          key={label.id}
                          variant={isSelected ? 'default' : 'outline'}
                          className={`cursor-pointer ${isSelected ? label.color : ''} hover:opacity-80`}
                          onClick={() => {
                            setSelectedLabels(prev => 
                              isSelected 
                                ? prev.filter(id => id !== label.id)
                                : [...prev, label.id]
                            );
                          }}
                        >
                          {label.name}
                        </Badge>
                      );
                    })}
                  </div>
                </div>
                
                {selectedLabels.length > 0 && (
                  <div className="space-y-2">
                    <div className="text-sm font-medium">Selected labels</div>
                    <div className="flex flex-wrap gap-2">
                      {availableLabels
                        .filter(label => selectedLabels.includes(label.id))
                        .map(label => (
                          <Badge 
                            key={label.id} 
                            className={`${label.color} hover:opacity-80`}
                          >
                            {label.name}
                          </Badge>
                        ))
                      }
                    </div>
                  </div>
                )}
              </PopoverContent>
            </Popover>
           
          </div>

          <Separator className="my-4" />

          {/* Body */}
          <div className="space-y-5">
            <div className="space-y-2">
              <Label htmlFor="project-name">Project name</Label>
              <Input
                id="project-name"
                placeholder="Add project name…"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="project-desc">Description</Label>
              <Textarea
                id="project-desc"
                placeholder="Write a description, a project brief, or collect ideas…"
                className="min-h-[9rem]"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>

            {/* Milestones Section */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <Tag className="h-4 w-4 text-muted-foreground" />
                  <h3 className="text-sm font-medium">Milestones</h3>
                  <span className="text-xs text-muted-foreground">
                    {milestones.filter(m => m.title.trim() !== '').length} of {milestones.length}
                  </span>
                </div>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 text-sm text-primary"
                  onClick={addNewMilestone}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add Milestone
                </Button>
              </div>
              
              <div className="space-y-3">
                {milestones.map((milestone, index) => (
                  <div 
                    key={milestone.id} 
                    className={cn(
                      "border rounded-lg overflow-hidden transition-all duration-200",
                      milestone.isExpanded ? "p-4" : "p-3"
                    )}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="flex h-6 w-6 items-center justify-center rounded-full bg-muted text-xs font-medium">
                          {index + 1}
                        </div>
                        <div className="min-w-0">
                          {milestone.title ? (
                            <div className="font-medium truncate">{milestone.title}</div>
                          ) : (
                            <div className="text-muted-foreground italic">Untitled Milestone</div>
                          )}
                          {!milestone.isExpanded && milestone.date && (
                            <div className="text-xs text-muted-foreground">
                              Due: {format(milestone.date, "MMM d, yyyy")}
                            </div>
                          )}
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="h-8 w-8 p-0"
                        onClick={() => toggleMilestone(milestone.id)}
                      >
                        {milestone.isExpanded ? (
                          <Minus className="h-4 w-4" />
                        ) : (
                          <Plus className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                    
                    {milestone.isExpanded && (
                      <div className="mt-4 space-y-4">
                        <div className="space-y-1">
                          <Label htmlFor={`milestone-${milestone.id}-title`}>Title</Label>
                          <Input
                            id={`milestone-${milestone.id}-title`}
                            placeholder="Milestone title"
                            value={milestone.title}
                            onChange={(e) => {
                              updateMilestoneField(milestone.id, 'title', e.target.value);
                            }}
                          />
                        </div>
                        
                        <div className="space-y-1">
                          <Label>Due date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal",
                                  !milestone.date && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {milestone.date ? (
                                  format(milestone.date, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0">
                              <Calendar
                                mode="single"
                                selected={milestone.date}
                                onSelect={(date) => {
                                  updateMilestoneField(milestone.id, 'date', date || undefined);
                                }}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        
                        <div className="space-y-1">
                          <Label htmlFor={`milestone-${milestone.id}-desc`}>Description</Label>
                          <Textarea
                            id={`milestone-${milestone.id}-desc`}
                            placeholder="Add a description"
                            value={milestone.description}
                            onChange={(e) => {
                              updateMilestoneField(milestone.id, 'description', e.target.value);
                            }}
                            className="min-h-[80px]"
                          />
                        </div>
                        
                        <div className="flex justify-between items-center pt-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="text-destructive hover:text-destructive"
                            onClick={() => removeMilestone(milestone.id)}
                            disabled={milestones.length <= 1}
                          >
                            <Trash2 className="h-4 w-4 mr-1" />
                            Remove Milestone
                          </Button>
                          
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleMilestone(milestone.id)}
                          >
                            Done
                          </Button>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

          </div> {/* End of scrollable content */}
          
          {/* Sticky Footer */}
          <div className="border-t p-4 flex justify-end gap-2 sticky bottom-0 bg-white z-10">
            <DialogClose asChild>
              <Button type="button" variant="outline">
                Cancel
              </Button>
            </DialogClose>
            <Button type="submit" onClick={handleSubmit}>
              Create project
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
