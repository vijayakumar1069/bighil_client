"use client";
import React, { useEffect, useCallback } from "react";
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Mail, Plus, Shield, Trash2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { roleBadgeColors, roleIcons } from "@/utils/adminsConstants";
import VisibilityToggle from "./VisibilityToggle";

const AdminAccountsStep = ({
  form,
  selectedClient,
  fields,
  append,
  remove,
  viewMode,
}) => {
  // Safe watch with fallbacks
  const watchedEmails =
    form.watch(fields.map((_, index) => `admins.${index}.email`)) || [];

  const watchedConfirmEmails =
    form.watch(fields.map((_, index) => `admins.${index}.confirmEmail`)) || [];

  const debouncedValidation = useCallback(
    debounce((index) => {
      const email = form.getValues(`admins.${index}.email`) || "";
      const confirmEmail = form.getValues(`admins.${index}.confirmEmail`) || "";

      if (email.trim() && confirmEmail.trim()) {
        form.trigger(`admins.${index}.confirmEmail`);
      }
    }, 300),
    [form]
  );
  // Safe validation effect
  useEffect(() => {
    fields.forEach((_, index) => {
      const email = watchedEmails[index];
      const confirmEmail = watchedConfirmEmails[index];

      if (email && confirmEmail) {
        debouncedValidation(index);
      }
    });
  }, [watchedEmails, watchedConfirmEmails, debouncedValidation, fields]);

  // Simple debounce function
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
    };
  }

  // Simplified effect with debouncing
  useEffect(() => {
    fields.forEach((_, index) => {
      debouncedValidation(index);
    });
  }, [watchedEmails, debouncedValidation, fields]);

  // Function to get the next role in sequence for first 3 admins
  const getNextRoleInSequence = () => {
    if (fields.length === 0) return "SUPER ADMIN";
    if (fields.length === 1) return "SUB ADMIN";
    if (fields.length === 2) return "ADMIN";
    // After 3 admins, only SUPER ADMIN can be added
    return "SUPER ADMIN";
  };

  // Function to get available roles based on position and existing roles
  const getAvailableRoles = (currentIndex, currentValue) => {
    // In edit mode, we should allow existing roles to remain
    if (viewMode || selectedClient) {
      // When editing, always include the current value and allow all roles
      const allRoles = ["SUPER ADMIN", "SUB ADMIN", "ADMIN"];

      // Make sure current value is included
      if (currentValue && !allRoles.includes(currentValue)) {
        allRoles.push(currentValue);
      }

      return allRoles;
    }

    // Original logic for new clients
    if (currentIndex === 0) {
      return ["SUPER ADMIN"];
    }

    if (currentIndex < 3) {
      const roles = [];
      if (currentIndex === 1) {
        roles.push("SUB ADMIN");
      } else if (currentIndex === 2) {
        roles.push("ADMIN");
      }

      if (currentValue && !roles.includes(currentValue)) {
        roles.push(currentValue);
      }

      return roles;
    }

    return ["SUPER ADMIN"];
  };

  // Function to check if we can add more admins
  const canAddAdmin = () => {
    // Always allow if less than 3 admins
    if (fields.length < 3) return true;

    // After 3, we can still add more SUPER ADMINs
    return true;
  };

  // Function to check if an admin can be deleted
  const canDeleteAdmin = (index) => {
    // Can't delete if in view mode
    if (viewMode) return false;

    // Can't delete the first admin (primary admin)
    if (index === 0) return false;

    // For existing clients, allow deletion of any admin except the first
    if (selectedClient) return true;

    return fields.length > 1 && (index >= 3 || fields.length > 3);
  };

  return (
    <div className="space-y-6 ">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="p-2 rounded-lg bg-purple dark:bg-purple-900/50">
            <Shield className="h-5 w-5 text-white dark:text-purple-400" />
          </div>
          <h3 className="text-xl font-semibold text-text_color dark:text-white">
            Admin Accounts
          </h3>
        </div>

        {!viewMode && canAddAdmin() && (
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                  type="button"
                  size="sm"
                  onClick={() =>
                    append({
                      name: "",
                      email: "",
                      confirmEmail: "", // Add this
                      role: getNextRoleInSequence(),
                    })
                  }
                  className="bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary/90 text-white shadow-md hover:shadow-primary/30 transition-all"
                >
                  <span className="flex items-center">
                    <Plus className="mr-2 h-4 w-4" />
                    Add Admin
                  </span>
                </Button>
              </TooltipTrigger>
              <TooltipContent className="bg-black text-text-text_color text-white border-gray-700">
                {fields.length < 3
                  ? `Add ${getNextRoleInSequence().toLowerCase()} to this company`
                  : "Add another super admin to this company"}
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        )}
      </div>

      <div className="space-y-6">
        {fields.map((field, index) => {
          const watchedEmail = form.watch(`admins.${index}.email`);
          const watchedConfirmEmail = form.watch(
            `admins.${index}.confirmEmail`
          );

          return (
            <div
              key={field.id}
              className={cn(
                "space-y-5 p-5 rounded-xl border border-gray-200 dark:border-gray-700",
                "transition-all hover:border-primary/50 hover:shadow-sm",
                "relative group bg-white dark:bg-texttext-text_color/50"
              )}
            >
              <div className="absolute -top-3 left-4 bg-white px-3 py-1 text-sm font-medium text-gray-700 dark:text-gray-300 rounded-lg border border-gray-200 dark:border-gray-700 shadow-sm flex items-center">
                Admin <span className="ml-1 text-blue">#{index + 1}</span>
                {index === 0 && (
                  <Badge className="ml-2 bg-primary text-white dark:bg-primary/20 dark:text-primary-200">
                    Primary
                  </Badge>
                )}
              </div>

              {/* Enhanced delete button with better conditions */}
              {canDeleteAdmin(index) && (
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className={cn(
                          "absolute right-2 -top-2 opacity-0 group-hover:opacity-100",
                          "transition-all duration-200 rounded-full w-8 h-8",
                          "bg-red hover:bg-red text-white shadow-md hover:shadow-lg",
                          "transform hover:scale-105"
                        )}
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent className="bg-black text-white border-gray-700">
                      <p>Remove this admin</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              )}

              <FormField
                control={form.control}
                name={`admins.${index}.name`}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                      <User className="h-4 w-4 text-primary" />
                      <span>Full Name</span>
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="John Doe"
                        {...field}
                        value={field.value || ""} // Safe default
                        className="border-gray-300   dark:border-gray-600 dark:bg-texttext-text_color dark:text-white"
                        readOnly={viewMode}
                      />
                    </FormControl>
                    <FormMessage className="text-red dark:text-red" />
                  </FormItem>
                )}
              />

              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                <FormField
                  control={form.control}
                  name={`admins.${index}.email`}
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                        <Mail className="h-4 w-4 text-primary" />
                        <span>Email Address</span>
                      </FormLabel>
                      <FormControl>
                        <Input
                          placeholder="john@company.com"
                          {...field}
                          value={field.value || ""} // Safe default
                          className="border-gray-300   dark:border-gray-600 dark:bg-texttext-text_color dark:text-white"
                          type="email"
                          readOnly={viewMode}
                          onChange={(e) => {
                            field.onChange(e);

                            // If in edit mode and confirmEmail exists, trigger validation
                            if (selectedClient) {
                              const confirmEmail = form.getValues(
                                `admins.${index}.confirmEmail`
                              );
                              if (confirmEmail && confirmEmail.trim() !== "") {
                                // Use setTimeout to ensure the form value is updated first
                                setTimeout(() => {
                                  form.trigger(`admins.${index}.confirmEmail`);
                                }, 0);
                              }
                            }
                          }}
                          onPaste={(e) => {
                            e.preventDefault();
                          }}
                          onCopy={(e) => {
                            e.preventDefault();
                          }}
                        />
                      </FormControl>
                      <FormMessage className="text-red dark:text-red" />
                    </FormItem>
                  )}
                />
                {!viewMode && watchedEmail && watchedEmail.trim() !== "" && (
                  <FormField
                    control={form.control}
                    name={`admins.${index}.confirmEmail`}
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                          <Mail className="h-4 w-4 text-primary" />
                          <span>Confirm Email</span>
                        </FormLabel>
                        <FormControl>
                          <Input
                            placeholder="john@company.com"
                            {...field}
                            value={field.value || ""} // Safe default
                            className="border-gray-300 dark:border-gray-600 dark:bg-texttext-text_color dark:text-white"
                            type="email"
                            readOnly={viewMode}
                            onChange={(e) => {
                              field.onChange(e);
                              // Remove the immediate validation trigger
                              // Let the useEffect handle validation with debouncing
                            }}
                            onPaste={(e) => {
                              e.preventDefault();
                            }}
                            onCopy={(e) => {
                              e.preventDefault();
                            }}
                            onBlur={(e) => {
                              // Only trigger validation on blur to avoid interrupting typing
                              const email = form.getValues(
                                `admins.${index}.email`
                              );
                              const confirmEmail = e.target.value;
                              if (email && confirmEmail) {
                                form.trigger(`admins.${index}.confirmEmail`);
                              }
                            }}
                          />
                        </FormControl>
                        <FormMessage className="text-red dark:text-red" />
                      </FormItem>
                    )}
                  />
                )}

                <FormField
                  control={form.control}
                  name={`admins.${index}.role`}
                  render={({ field }) => {
                    const availableRoles = getAvailableRoles(
                      index,
                      field.value
                    );

                    return (
                      <FormItem>
                        <FormLabel className="flex items-center space-x-2 text-gray-700 dark:text-gray-300">
                          <Shield className="h-4 w-4 text-primary dark:text-purple-400" />
                          <span>Role</span>
                        </FormLabel>
                        <Select
                          onValueChange={field.onChange}
                          defaultValue={field.value}
                          disabled={!viewMode && !selectedClient && index < 3} // Only disable for new clients in sequence
                        >
                          <FormControl>
                            <SelectTrigger
                              disabled={
                                viewMode || (!selectedClient && index < 3)
                              } // Only disable for new clients
                              className="border-gray-300  dark:border-gray-600 dark:bg-texttext-text_color dark:text-white"
                            >
                              <div className="flex items-center">
                                {roleIcons[field.value]}
                                <SelectValue placeholder="Select role" />
                              </div>
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent className="bg-white dark:bg-text text-text_color border-gray-200 dark:border-gray-700 shadow-lg">
                            {getAvailableRoles(index, field.value).map(
                              (role) => (
                                <SelectItem
                                  key={role}
                                  value={role}
                                  className="hover:bg-purple-50 dark:hover:bg-gray-700"
                                >
                                  <div className="flex items-center">
                                    <span>{role.replace("_", " ")}</span>
                                    {field.value === role && (
                                      <Badge
                                        className={`ml-2 ${roleBadgeColors[role]}`}
                                      >
                                        Current
                                      </Badge>
                                    )}
                                  </div>
                                </SelectItem>
                              )
                            )}
                          </SelectContent>
                        </Select>

                        <FormMessage className="text-red dark:text-red" />
                      </FormItem>
                    );
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>
      <div className="">
        <VisibilityToggle form={form} viewMode={viewMode} />
      </div>
    </div>
  );
};

export default AdminAccountsStep;
