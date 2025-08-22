<?php

class Validator {
    private $errors = [];

    public function validateEmail($email, $field_name = 'email') {
        if (empty($email)) {
            $this->errors[$field_name] = ucfirst($field_name) . ' is required';
        } elseif (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
            $this->errors[$field_name] = 'Invalid email format';
        }
        return $this;
    }

    public function validatePassword($password, $field_name = 'password') {
        if (empty($password)) {
            $this->errors[$field_name] = ucfirst($field_name) . ' is required';
        } elseif (strlen($password) < PASSWORD_MIN_LENGTH) {
            $this->errors[$field_name] = ucfirst($field_name) . ' must be at least ' . PASSWORD_MIN_LENGTH . ' characters';
        }
        return $this;
    }

    public function validateRequired($value, $field_name) {
        if (empty(trim($value))) {
            $this->errors[$field_name] = ucfirst($field_name) . ' is required';
        }
        return $this;
    }

    public function validateMinLength($value, $min_length, $field_name) {
        if (strlen(trim($value)) < $min_length) {
            $this->errors[$field_name] = ucfirst($field_name) . " must be at least {$min_length} characters";
        }
        return $this;
    }

    public function validateMaxLength($value, $max_length, $field_name) {
        if (strlen(trim($value)) > $max_length) {
            $this->errors[$field_name] = ucfirst($field_name) . " must not exceed {$max_length} characters";
        }
        return $this;
    }

    public function validatePhone($phone, $field_name = 'phone') {
        if (!empty($phone)) {
            // Remove all non-numeric characters
            $cleanPhone = preg_replace('/[^0-9]/', '', $phone);
            if (strlen($cleanPhone) < 10) {
                $this->errors[$field_name] = 'Phone number must be at least 10 digits';
            }
        }
        return $this;
    }

    public function validateDate($date, $field_name = 'date') {
        if (!empty($date)) {
            $d = DateTime::createFromFormat('Y-m-d', $date);
            if (!$d || $d->format('Y-m-d') !== $date) {
                $this->errors[$field_name] = 'Invalid date format. Use YYYY-MM-DD';
            }
        }
        return $this;
    }

    public function hasErrors() {
        return !empty($this->errors);
    }

    public function getErrors() {
        return $this->errors;
    }

    public function getFirstError() {
        return reset($this->errors);
    }

    public function addError($field, $message) {
        $this->errors[$field] = $message;
        return $this;
    }
}
