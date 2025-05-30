variable "aws_region" {
  default = "us-east-1"  # ili tvoja sandbox regija
}

variable "instance_type" {
  default = "t2.micro"
}

variable "key_name" {
  description = "SSH key pair name"
  default     = "sandbox-key"  # možeš ostaviti ovako ako ne koristiš SSH pristup
}

