variable "aws_region" {
  description = "AWS region to deploy"
  default     = "us-east-1"
}

variable "instance_type" {
  description = "EC2 instance type"
  default     = "t3.micro"
}

variable "key_pair_name" {
  description = "Name of existing AWS key pair for SSH"
  type        = string
}

variable "my_ip" {
  description = "Your public IP address in CIDR notation to allow SSH access"
  type        = string
}

variable "repo_clone_url" {
  description = "Git clone URL of your project repository"
  type        = string
}

variable "repo_name" {
  description = "Name of the repo folder created by git clone"
  type        = string
}
